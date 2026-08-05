import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSseNotifications, handleSseEvent } from './use-sse'
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

describe('useSseNotifications & handleSseEvent', () => {
  beforeEach(() => {
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

  it('debe agregar un toast al recibir un mensaje SSE genérico', async () => {
    renderHook(() => useSseNotifications('/api/v1/events'))

    await waitFor(() => expect(MockEventSource.instance).not.toBeNull())

    act(() => {
      MockEventSource.instance?.onmessage?.({
        data: JSON.stringify({
          title: 'Plaza Liberada',
          message: 'La plaza A-12 ha sido liberada.',
          type: 'success',
        }),
      })
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
