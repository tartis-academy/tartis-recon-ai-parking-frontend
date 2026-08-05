import { useEffect, useRef, useState } from 'react'
import { useToastStore } from '../app/stores/toast-store'
import { SSE_RECONNECT_DELAY_MS } from '../app/constants'
import { notificationLabels } from '../app/labels'
import { getAuthToken } from './keycloak'
import { queryClient } from './query-client'

// Envoltorio que emiten de verdad los eventos de dominio de stay-service
// (StayCreatedEvent / StayClosedEvent). No trae title ni message: el texto de
// la notificacion lo compone el shell, que es el adaptador entre el limite
// backend y el DOM (docs/EVENTS.md).
export interface SseEnvelope {
  eventId?: string
  type?: string
  version?: string
  occurredAt?: string
  data?: Record<string, unknown>
}

// Las claves son ademas la lista de eventos que se suscriben: un evento con
// nombre y sin listener no llega a onmessage, se pierde en silencio.
const EVENT_QUERY_MAP: Record<string, string[]> = {
  stay_created: ['stays'],
  stay_updated: ['stays'],
  spot_updated: ['spots'],
  vehicle_updated: ['vehicles'],
  ticket_updated: ['tickets'],
  entry_ticket_updated: ['tickets'],
}

const asText = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

const asAmount = (value: unknown): string | null => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? `${n.toFixed(2)} €` : null
}

// Redaccion del toast a partir del evento de dominio. message null = no se
// sabe describirlo con los datos que han llegado, y se cae a un texto generico
// en vez de inventar uno que no aporta.
function describeEvent(
  eventName: string,
  data: Record<string, unknown>,
): { title: string; message: string | null } {
  const plate = asText(data.plate)
  const withPlate = plate ? `${notificationLabels.plate} ${plate}` : null

  switch (eventName) {
    case 'stay_created':
      return { title: notificationLabels.stayCreatedTitle, message: withPlate }
    case 'stay_updated': {
      const amount = asAmount(data.totalAmount)
      return {
        title: notificationLabels.stayClosedTitle,
        message: withPlate && amount ? `${withPlate} · ${amount}` : withPlate,
      }
    }
    default:
      return { title: notificationLabels.systemTitle, message: null }
  }
}

export function handleSseEvent(
  eventName: string,
  envelope: SseEnvelope,
  addToast: ReturnType<typeof useToastStore.getState>['addToast'],
) {
  const queryKeysToInvalidate = EVENT_QUERY_MAP[eventName]
  if (queryKeysToInvalidate) {
    queryClient.invalidateQueries({ queryKey: queryKeysToInvalidate })
  }

  const { title, message } = describeEvent(eventName, envelope.data ?? {})

  addToast({
    id: envelope.eventId,
    // El tipo sale del evento, no del payload: el campo `type` del backend es
    // el nombre de la clase Java (StayCreatedEvent), no un nivel de toast.
    type: message ? 'success' : 'info',
    title,
    message: message ?? notificationLabels.genericEvent,
  })
}

export function useSseNotifications(
  baseUrl: string = '/api/v1/events',
  enabled: boolean = true,
) {
  const [isConnected, setIsConnected] = useState(false)
  const addToast = useToastStore((s) => s.addToast)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) return

    let eventSource: EventSource | null = null
    let cancelled = false

    const scheduleReconnect = () => {
      if (cancelled) return
      reconnectTimerRef.current = setTimeout(() => {
        connect()
      }, SSE_RECONNECT_DELAY_MS)
    }

    const connect = async () => {
      try {
        // El token se pide en cada (re)conexión: caduca durante la vida del stream
        const token = await getAuthToken()
        if (cancelled) return

        if (!token) {
          setIsConnected(false)
          scheduleReconnect()
          return
        }

        const finalUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`

        eventSource = new EventSource(finalUrl)

        eventSource.onopen = () => {
          setIsConnected(true)
        }

        const dispatch = (eventName: string, raw: string) => {
          try {
            handleSseEvent(eventName, JSON.parse(raw) as SseEnvelope, addToast)
          } catch {
            handleSseEvent(eventName, {}, addToast)
          }
        }

        // Eventos sin nombre: no hay nada que describir, solo notificar
        eventSource.onmessage = (event: MessageEvent) => dispatch('', event.data)

        // Escuchar eventos nombrados del dominio
        Object.keys(EVENT_QUERY_MAP).forEach((eventName) => {
          eventSource?.addEventListener(eventName, (event: MessageEvent) =>
            dispatch(eventName, event.data),
          )
        })

        eventSource.onerror = () => {
          setIsConnected(false)
          if (eventSource) {
            eventSource.close()
            eventSource = null
          }
          scheduleReconnect()
        }
      } catch (err) {
        console.error('Error al inicializar SSE EventSource:', err)
        setIsConnected(false)
        scheduleReconnect()
      }
    }

    connect()

    return () => {
      cancelled = true
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
