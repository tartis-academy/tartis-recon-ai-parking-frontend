import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSseNotifications, handleSseEvent } from './use-sse'
import { useToastStore } from '../app/stores/toast-store'
import { queryClient } from './query-client'

class MockEventSource {
  static instance: MockEventSource | null = null
  url: string
  onopen: (() => void) | null = null
  onmessage: ((e: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  eventListeners: Record<string, ((e: { data: string }) => void)[]> = {}
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instance = this
  }

  addEventListener(event: string, callback: (e: { data: string }) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }
}

describe('useSseNotifications & handleSseEvent', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts()
    MockEventSource.instance = null
    vi.stubGlobal('EventSource', MockEventSource)
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe conectarse al endpoint SSE especificado', () => {
    renderHook(() => useSseNotifications('/v1/events'))

    expect(MockEventSource.instance).not.toBeNull()
    expect(MockEventSource.instance?.url).toBe('/v1/events')
  })

  it('debe incluir token de auth en la URL si existe en localStorage', () => {
    localStorage.setItem('access_token', 'my-secret-token')

    renderHook(() => useSseNotifications('/v1/events'))

    expect(MockEventSource.instance?.url).toBe('/v1/events?access_token=my-secret-token')

    localStorage.removeItem('access_token')
  })

  it('debe agregar un toast al recibir un mensaje SSE genérico', () => {
    renderHook(() => useSseNotifications('/v1/events'))

    act(() => {
      if (MockEventSource.instance?.onmessage) {
        MockEventSource.instance.onmessage({
          data: JSON.stringify({
            title: 'Plaza Liberada',
            message: 'La plaza A-12 ha sido liberada.',
            type: 'success',
          }),
        })
      }
    })

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Plaza Liberada')
    expect(toasts[0].message).toBe('La plaza A-12 ha sido liberada.')
    expect(toasts[0].type).toBe('success')
  })

  it('debe invalidar la caché de TanStack Query al recibir un evento de dominio como stay_updated', () => {
    const addToastSpy = vi.fn()

    handleSseEvent(
      {
        eventType: 'stay_updated',
        title: 'Estancia actualizada',
        message: 'Vehículo finalizó su estancia',
      },
      addToastSpy,
    )

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['stays'],
    })
    expect(addToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Estancia actualizada',
        message: 'Vehículo finalizó su estancia',
        type: 'success',
      }),
    )
  })
})
