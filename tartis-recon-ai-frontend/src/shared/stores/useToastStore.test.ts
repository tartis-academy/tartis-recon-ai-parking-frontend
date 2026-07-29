import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToastStore } from './useToastStore'
import apiClient from '@/lib/api-client'
import type { AxiosError } from 'axios'

describe('useToastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useToastStore.getState().clearToasts()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a toast correctly', () => {
    useToastStore.getState().addToast({ message: 'Test toast', type: 'info' })

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('Test toast')
    expect(toasts[0].type).toBe('info')
    expect(toasts[0].id).toBeDefined()
  })

  it('deduplicates toasts with identical messages', () => {
    useToastStore.getState().addToast({ message: 'Error duplicado', type: 'error' })
    useToastStore.getState().addToast({ message: 'Error duplicado', type: 'error' })

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
  })

  it('automatically removes toast after duration (default 5000ms)', () => {
    useToastStore.getState().addToast({ message: 'Auto dismiss toast' })

    expect(useToastStore.getState().toasts).toHaveLength(1)

    vi.advanceTimersByTime(5000)

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('removes a toast by id', () => {
    useToastStore.getState().addToast({ id: 't-1', message: 'First toast' })
    useToastStore.getState().addToast({ id: 't-2', message: 'Second toast' })

    useToastStore.getState().removeToast('t-1')

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].id).toBe('t-2')
  })

  it('clears all toasts', () => {
    useToastStore.getState().addToast({ message: 'Toast 1' })
    useToastStore.getState().addToast({ message: 'Toast 2' })

    useToastStore.getState().clearToasts()

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('pushes error toast when response interceptor receives an API error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseInterceptor = (apiClient.interceptors.response as any).handlers[0]

    const mockAxiosError = {
      message: 'Request failed',
      response: {
        data: { message: 'Error de servidor simulado' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {},
      },
    } as AxiosError

    await expect(responseInterceptor.rejected(mockAxiosError)).rejects.toEqual(
      expect.objectContaining({
        message: 'Error de servidor simulado',
        status: 500,
      }),
    )

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('Error de servidor simulado')
    expect(toasts[0].type).toBe('error')
  })
})
