import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSseNotifications } from './use-sse'
import { useToastStore } from '../app/stores/toast-store'

class MockEventSource {
  static instance: MockEventSource | null = null
  url: string
  onopen: (() => void) | null = null
  onmessage: ((e: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instance = this
  }
}

describe('useSseNotifications', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts()
    MockEventSource.instance = null
    vi.stubGlobal('EventSource', MockEventSource)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe conectarse al endpoint SSE especificado', () => {
    renderHook(() => useSseNotifications('/v1/events'))

    expect(MockEventSource.instance).not.toBeNull()
    expect(MockEventSource.instance?.url).toBe('/v1/events')
  })

  it('debe agregar un toast al recibir un mensaje SSE en formato JSON', () => {
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
})
