import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/shared/stores/useToastStore'

export interface RealtimeSyncOptions {
  enabled?: boolean
  url?: string
}

export type ConnectionStatus =
  | 'unconfigured'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

export interface RealtimeSyncState {
  status: ConnectionStatus
}

type ConnectionEventStatus = 'connecting' | 'connected' | 'reconnecting' | 'error' | null

export function useRealtimeSync(options: RealtimeSyncOptions = {}): RealtimeSyncState {
  const { enabled = true, url = import.meta.env.VITE_REALTIME_URL } = options
  const queryClient = useQueryClient()
  const isConfigured = enabled && Boolean(url)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionEventStatus>(
    isConfigured ? 'connecting' : null,
  )
  const errorToastShown = useRef(false)

  const status: ConnectionStatus = !isConfigured
    ? 'unconfigured'
    : (connectionStatus ?? 'connecting')

  useEffect(() => {
    if (!isConfigured) {
      if (enabled && !url) {
        useToastStore.getState().addToast({
          message: 'Real-time updates are not available. The synchronization service is not configured.',
          type: 'warning',
        })
      }
      return
    }

    let eventSource: EventSource | null = null
    let isCleanedUp = false

    const setupEventSource = async () => {
      try {
        eventSource = new EventSource(url)
      } catch {
        if (!isCleanedUp) {
          setConnectionStatus('error')
          useToastStore.getState().addToast({
            message: 'Could not connect to the real-time update service. Please try again later.',
            type: 'error',
          })
        }
        return
      }

      eventSource.addEventListener('open', () => {
        if (isCleanedUp) return
        setConnectionStatus('connected')
        errorToastShown.current = false
      })

      eventSource.addEventListener('stay_updated', () => {
        if (isCleanedUp) return
        queryClient.invalidateQueries({ queryKey: ['stays'] })
        queryClient.invalidateQueries({ queryKey: ['spots'] })
      })

      eventSource.addEventListener('spot_updated', () => {
        if (isCleanedUp) return
        queryClient.invalidateQueries({ queryKey: ['spots'] })
      })

      eventSource.addEventListener('vehicle_updated', () => {
        if (isCleanedUp) return
        queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      })

      eventSource.addEventListener('ticket_updated', () => {
        if (isCleanedUp) return
        queryClient.invalidateQueries({ queryKey: ['tickets'] })
      })

      eventSource.addEventListener('error', () => {
        if (isCleanedUp) return
        setConnectionStatus('reconnecting')
        if (!errorToastShown.current) {
          useToastStore.getState().addToast({
            message: 'Real-time connection lost. Reconnecting automatically...',
            type: 'warning',
          })
          errorToastShown.current = true
        }
      })
    }

    setupEventSource()

    return () => {
      isCleanedUp = true
      eventSource?.close()
    }
  }, [enabled, url, queryClient, isConfigured])

  return { status }
}
