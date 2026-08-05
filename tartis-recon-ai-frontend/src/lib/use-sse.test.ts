import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSseNotifications, handleSseEvent, type ParkingEvent } from './use-sse'
import { useToastStore } from '../app/stores/toast-store'
import { queryClient } from './query-client'
import { getAuthToken } from './keycloak'

vi.mock('./keycloak', () => ({
  getAuthToken: vi.fn(),
}))

const mockedGetAuthToken = vi.mocked(getAuthToken)

class MockEventSource {
  static instance: MockEventSource | null = null
  static instances: MockEventSource[] = []
  url: string
  onopen: (() => void) | null = null
  onmessage: ((e: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  eventListeners: Record<string, ((e: { data: string }) => void)[]> = {}
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instance = this
    MockEventSource.instances.push(this)
  }

  addEventListener(event: string, callback: (e: { data: string }) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }
}

// Copiados de StayCreatedEvent.java / StayClosedEvent.java de stay-service.
// Si el backend cambia el contrato, estos tests deben romperse.
const STAY_CREATED_EVENT = {
  eventId: '5f0a1b2c-3d4e-4f50-8a9b-0c1d2e3f4a5b',
  type: 'StayCreatedEvent',
  version: 'v1',
  occurredAt: '2026-08-05T09:50:16Z',
  data: {
    stayId: 'caa405e6-97ac-4897-8f49-b9cfe7e3ad8c',
    vehicleId: 'b2f772ad-9081-4758-a7c1-e5f0480b0f64',
    vehicleType: 'CAR',
    spotId: 'b8e1a5a5-4858-407e-ad8b-d187b1c93ef9',
    tariffId: '3ffb2828-dc9e-4846-a900-2baa66b27481',
    plate: '7777BCD',
    checkIn: '2026-08-05T09:50:16Z',
  },
}

const STAY_CLOSED_EVENT = {
  eventId: '9c8b7a65-4321-4def-9876-543210fedcba',
  type: 'StayClosedEvent',
  version: 'v1',
  occurredAt: '2026-08-05T09:51:48Z',
  data: {
    stayId: 'caa405e6-97ac-4897-8f49-b9cfe7e3ad8c',
    spotId: 'b8e1a5a5-4858-407e-ad8b-d187b1c93ef9',
    plate: '7777BCD',
    entryDate: '2026-08-05T09:50:16Z',
    exitDate: '2026-08-05T09:51:48Z',
    totalAmount: 0.13,
  },
}

describe('useSseNotifications & handleSseEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useToastStore.getState().clearToasts()
    MockEventSource.instance = null
    MockEventSource.instances = []
    vi.stubGlobal('EventSource', MockEventSource)
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined)
    mockedGetAuthToken.mockResolvedValue('token-de-keycloak')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe adjuntar el token de Keycloak a la URL del stream', async () => {
    renderHook(() => useSseNotifications('/api/v1/events'))

    await waitFor(() => {
      expect(MockEventSource.instance?.url).toBe(
        '/api/v1/events?access_token=token-de-keycloak',
      )
    })
  })

  it('no debe abrir el stream sin token: Kong lo rechazaría con 401', async () => {
    mockedGetAuthToken.mockResolvedValue(null)

    renderHook(() => useSseNotifications('/api/v1/events'))

    await waitFor(() => {
      expect(mockedGetAuthToken).toHaveBeenCalled()
    })
    expect(MockEventSource.instance).toBeNull()
  })

  it('debe pedir un token nuevo al reconectar, no reutilizar el de la primera conexión', async () => {
    vi.useFakeTimers()
    mockedGetAuthToken.mockResolvedValueOnce('token-inicial')
    mockedGetAuthToken.mockResolvedValueOnce('token-renovado')

    renderHook(() => useSseNotifications('/api/v1/events'))

    await vi.waitFor(() => expect(MockEventSource.instances).toHaveLength(1))
    expect(MockEventSource.instances[0].url).toContain('access_token=token-inicial')

    await act(async () => {
      MockEventSource.instances[0].onerror?.()
      await vi.advanceTimersByTimeAsync(3000)
    })

    expect(MockEventSource.instances).toHaveLength(2)
    expect(MockEventSource.instances[1].url).toContain('access_token=token-renovado')

    vi.useRealTimers()
  })

  it('debe cerrar el stream y no reconectar tras desmontar', async () => {
    vi.useFakeTimers()

    const { unmount } = renderHook(() => useSseNotifications('/api/v1/events'))
    await vi.waitFor(() => expect(MockEventSource.instances).toHaveLength(1))
    const stream = MockEventSource.instances[0]

    unmount()
    expect(stream.close).toHaveBeenCalled()

    // Un error posterior no debe reprogramar la reconexion: el flag cancelled
    // del cleanup es lo unico que evita el bucle tras desmontar.
    await act(async () => {
      stream.onerror?.()
      await vi.advanceTimersByTimeAsync(3000)
    })
    expect(MockEventSource.instances).toHaveLength(1)

    vi.useRealTimers()
  })

  it('reenvia el evento al DOM como parking:* para que reaccionen los remotos', () => {
    const received: ParkingEvent[] = []
    const listener = (e: Event) => received.push((e as CustomEvent<ParkingEvent>).detail)
    window.addEventListener('parking:stay-created', listener)

    handleSseEvent('stay_created', STAY_CREATED_EVENT, vi.fn())

    window.removeEventListener('parking:stay-created', listener)

    expect(received).toHaveLength(1)
    expect(received[0].version).toBe(1)
    expect(received[0].source).toBe('shell')
    // el occurredAt es el del backend, no el del navegador
    expect(received[0].occurredAt).toBe(STAY_CREATED_EVENT.occurredAt)
    expect(received[0].data).toMatchObject({ plate: '7777BCD' })
  })

  it('traduce el nombre del evento: el nombre SSE no se reutiliza como nombre DOM', () => {
    const sseNamed = vi.fn()
    window.addEventListener('stay_updated', sseNamed)
    const domNamed = vi.fn()
    window.addEventListener('parking:stay-updated', domNamed)

    handleSseEvent('stay_updated', STAY_CLOSED_EVENT, vi.fn())

    window.removeEventListener('stay_updated', sseNamed)
    window.removeEventListener('parking:stay-updated', domNamed)

    expect(domNamed).toHaveBeenCalled()
    expect(sseNamed).not.toHaveBeenCalled()
  })

  it('no reenvia al DOM un evento que no esta en el catalogo', () => {
    const anyParkingEvent = vi.fn()
    const names = ['parking:stay-created', 'parking:stay-updated', 'parking:spot-updated']
    names.forEach((n) => window.addEventListener(n, anyParkingEvent))

    handleSseEvent('', { data: {} }, vi.fn())

    names.forEach((n) => window.removeEventListener(n, anyParkingEvent))

    expect(anyParkingEvent).not.toHaveBeenCalled()
  })

  it('debe describir el check-in con el payload real de StayCreatedEvent', async () => {
    renderHook(() => useSseNotifications('/api/v1/events'))

    await waitFor(() => expect(MockEventSource.instance).not.toBeNull())
    expect(Object.keys(MockEventSource.instance!.eventListeners)).toContain('stay_created')

    act(() => {
      MockEventSource.instance!.eventListeners.stay_created[0]({
        data: JSON.stringify(STAY_CREATED_EVENT),
      })
    })

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['stays'] })

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Entrada registrada')
    expect(toasts[0].message).toBe('Matrícula 7777BCD')
    expect(toasts[0].type).toBe('success')
    expect(toasts[0].id).toBe(STAY_CREATED_EVENT.eventId)
  })

  it('debe describir el check-out con el importe cobrado', () => {
    const addToastSpy = vi.fn()

    handleSseEvent('stay_updated', STAY_CLOSED_EVENT, addToastSpy)

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['stays'] })
    expect(addToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Salida registrada',
        message: 'Matrícula 7777BCD · 0.13 €',
        type: 'success',
      }),
    )
  })

  it('no debe usar el campo type del backend como nivel de toast', () => {
    const addToastSpy = vi.fn()

    // El backend manda type: "StayCreatedEvent", el nombre de la clase Java.
    handleSseEvent('stay_created', STAY_CREATED_EVENT, addToastSpy)

    expect(addToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' }),
    )
    expect(addToastSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'StayCreatedEvent' }),
    )
  })

  it('debe caer a un texto generico si el evento no trae datos describibles', () => {
    const addToastSpy = vi.fn()

    handleSseEvent('stay_created', { eventId: 'e1', data: {} }, addToastSpy)

    expect(addToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Entrada registrada',
        message: 'Se ha actualizado el estado del parking.',
        type: 'info',
      }),
    )
  })

  it('debe notificar un evento sin nombre sin inventarse un titulo', async () => {
    renderHook(() => useSseNotifications('/api/v1/events'))

    await waitFor(() => expect(MockEventSource.instance).not.toBeNull())

    act(() => {
      MockEventSource.instance?.onmessage?.({ data: 'texto suelto, no JSON' })
    })

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Notificación del sistema')
    expect(toasts[0].type).toBe('info')
  })
})
