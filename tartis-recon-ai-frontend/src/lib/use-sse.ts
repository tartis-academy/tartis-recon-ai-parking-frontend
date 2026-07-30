import { useEffect, useRef, useState } from 'react'
import { useToastStore, type ToastType } from '../app/stores/toast-store'
import { SSE_RECONNECT_DELAY_MS } from '../app/constants'
import { notificationLabels } from '../app/labels'

export interface SseEventPayload {
  id?: string
  type?: ToastType
  title?: string
  message: string
}

export function useSseNotifications(url: string = '/v1/events', enabled: boolean = true) {
  const [isConnected, setIsConnected] = useState(false)
  const addToast = useToastStore((s) => s.addToast)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) return

    let eventSource: EventSource | null = null

    const connect = () => {
      try {
        eventSource = new EventSource(url)

        eventSource.onopen = () => {
          setIsConnected(true)
        }

        eventSource.onmessage = (event) => {
          try {
            const data: SseEventPayload = JSON.parse(event.data)
            addToast({
              id: data.id,
              type: data.type || 'info',
              title: data.title || notificationLabels.systemTitle,
              message: data.message || event.data,
            })
          } catch {
            addToast({
              type: 'info',
              title: notificationLabels.systemTitle,
              message: event.data,
            })
          }
        }

        eventSource.onerror = () => {
          setIsConnected(false)
          if (eventSource) {
            eventSource.close()
          }
          reconnectTimerRef.current = setTimeout(() => {
            connect()
          }, SSE_RECONNECT_DELAY_MS)
        }
      } catch (err) {
        console.error('Error al inicializar SSE EventSource:', err)
        setIsConnected(false)
      }
    }

    connect()

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [url, enabled, addToast])

  return { isConnected }
}
