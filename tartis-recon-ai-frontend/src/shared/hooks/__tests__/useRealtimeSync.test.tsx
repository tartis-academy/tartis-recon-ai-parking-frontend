import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ReactNode } from 'react'
import { useRealtimeSync } from '../useRealtimeSync'
import { useToastStore } from '@/shared/stores/useToastStore'

describe('useRealtimeSync', () => {
  type Listener = (...args: unknown[]) => void

  let queryClient: QueryClient
  let listeners: Record<string, Listener> = {}
  let mockClose: () => void
  let addToastSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    listeners = {}
    mockClose = vi.fn()
    addToastSpy = vi.spyOn(useToastStore.getState(), 'addToast')
    addToastSpy.mockClear()

    class MockEventSource {
      url: string
      constructor(url: string) {
        this.url = url
      }
      addEventListener(event: string, cb: Listener) {
        listeners[event] = cb
      }
      removeEventListener() {}
      close() {
        mockClose()
      }
    }

    vi.stubGlobal('EventSource', MockEventSource)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    useToastStore.getState().clearToasts()
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should be unconfigured when disabled', () => {
    const { result } = renderHook(
      () => useRealtimeSync({ enabled: false, url: 'http://localhost/events' }),
      { wrapper },
    )

    expect(listeners).toEqual({})
    expect(result.current.status).toBe('unconfigured')
    expect(addToastSpy).not.toHaveBeenCalled()
  })

  it('should warn and be unconfigured when URL is missing', () => {
    const { result } = renderHook(() => useRealtimeSync({ enabled: true }), {
      wrapper,
    })

    expect(listeners).toEqual({})
    expect(result.current.status).toBe('unconfigured')
    expect(addToastSpy).toHaveBeenCalledWith({
      message: 'Real-time updates are not available. The synchronization service is not configured.',
      type: 'warning',
    })
  })

  it('should be connecting while waiting for open event', () => {
    const { result } = renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    expect(listeners['open']).toBeDefined()
    expect(result.current.status).toBe('connecting')
  })

  it('should register event listeners and invalidate stays and spots on stay_updated', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    renderHook(() => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }), {
      wrapper,
    })

    expect(listeners['stay_updated']).toBeDefined()

    act(() => {
      listeners['stay_updated']()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stays'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['spots'] })
  })

  it('should invalidate spots on spot_updated', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    renderHook(() => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }), {
      wrapper,
    })

    expect(listeners['spot_updated']).toBeDefined()
    act(() => {
      listeners['spot_updated']()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['spots'] })
  })

  it('should invalidate vehicles on vehicle_updated', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    renderHook(() => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }), {
      wrapper,
    })

    expect(listeners['vehicle_updated']).toBeDefined()
    act(() => {
      listeners['vehicle_updated']()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['vehicles'] })
  })

  it('should invalidate tickets on ticket_updated', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    renderHook(() => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }), {
      wrapper,
    })

    expect(listeners['ticket_updated']).toBeDefined()
    act(() => {
      listeners['ticket_updated']()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tickets'] })
  })

  it('should become connected on open event', async () => {
    const { result } = renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    act(() => {
      listeners['open']()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('connected')
    })
  })

  it('should become reconnecting and show warning toast on error event', async () => {
    const { result } = renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    act(() => {
      listeners['error']()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('reconnecting')
    })

    expect(addToastSpy).toHaveBeenCalledWith({
      message: 'Real-time connection lost. Reconnecting automatically...',
      type: 'warning',
    })
  })

  it('should show only one warning toast on repeated error events', async () => {
    renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    act(() => {
      listeners['error']()
      listeners['error']()
      listeners['error']()
    })

    await waitFor(() => {
      expect(addToastSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should reset error toast flag after open event', async () => {
    renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    act(() => {
      listeners['error']()
      listeners['open']()
      listeners['error']()
    })

    await waitFor(() => {
      expect(addToastSpy).toHaveBeenCalledTimes(2)
    })
  })

  it('should close EventSource on unmount', () => {
    const { unmount } = renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    unmount()
    expect(mockClose).toHaveBeenCalled()
  })

  it('should become error and show error toast when EventSource constructor fails', () => {
    vi.stubGlobal(
      'EventSource',
      class {
        constructor() {
          throw new Error('SSE not supported')
        }
      },
    )

    const { result } = renderHook(
      () => useRealtimeSync({ enabled: true, url: 'http://localhost/events' }),
      { wrapper },
    )

    expect(result.current.status).toBe('error')
    expect(addToastSpy).toHaveBeenCalledWith({
      message: 'Could not connect to the real-time update service. Please try again later.',
      type: 'error',
    })
  })
})
