import { useEffect, useRef, useState } from 'react'
import { useToastStore, type ToastType } from '../app/stores/toast-store'
import { SSE_RECONNECT_DELAY_MS } from '../app/constants'
import { notificationLabels } from '../app/labels'
import { queryClient } from './query-client'

export interface SseEventPayload {
  id?: string
  eventType?: string
  type?: ToastType
  title?: string
  message: string
}

const EVENT_QUERY_MAP: Record<string, string[]> = {
  stay_updated: ['stays'],
  spot_updated: ['spots'],
  vehicle_updated: ['vehicles'],
  ticket_updated: ['tickets'],
  entry_ticket_updated: ['tickets'],
}

export function handleSseEvent(
  data: SseEventPayload,
  addToast: ReturnType<typeof useToastStore.getState>['addToast'],
) {
  const eventType = data.eventType || ''

  // Invalidar caché en TanStack Query si el evento corresponde a una entidad
  const queryKeysToInvalidate = EVENT_QUERY_MAP[eventType]
  if (queryKeysToInvalidate) {
    queryClient.invalidateQueries({ queryKey: queryKeysToInvalidate })
  }

  // Disparar la notificación Toast flotante
  addToast({
    id: data.id,
    type: data.type || (eventType ? 'success' : 'info'),
    title: data.title || notificationLabels.systemTitle,
    message: data.message,
  })
}

export function useSseNotifications(
  baseUrl: string = '/v1/events',
  enabled: boolean = true,
) {
  const [isConnected, setIsConnected] = useState(false)
  const addToast = useToastStore((s) => s.addToast)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) return

    let eventSource: EventSource | null = null

    const connect = () => {
      try {
        const storedToken =
          typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null
        const finalUrl = storedToken
          ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(storedToken)}`
          : baseUrl

        eventSource = new EventSource(finalUrl)

        eventSource.onopen = () => {
          setIsConnected(true)
        }

        const handleRawMessage = (event: MessageEvent) => {
          try {
            const data: SseEventPayload = JSON.parse(event.data)
            handleSseEvent(data, addToast)
          } catch {
            handleSseEvent({ message: event.data }, addToast)
          }
        }

        eventSource.onmessage = handleRawMessage

        // Escuchar eventos nombrados del dominio
        const namedEvents = Object.keys(EVENT_QUERY_MAP)
        namedEvents.forEach((eventName) => {
          eventSource?.addEventListener(eventName, (event: MessageEvent) => {
            try {
              const data: SseEventPayload = JSON.parse(event.data)
              handleSseEvent({ ...data, eventType: eventName }, addToast)
            } catch {
              handleSseEvent({ eventType: eventName, message: event.data }, addToast)
            }
          })
        })

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
  }, [baseUrl, enabled, addToast])

  return { isConnected }
}
