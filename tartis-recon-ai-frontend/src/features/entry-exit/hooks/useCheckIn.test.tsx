import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCheckIn } from './useCheckIn'
import { stayService } from '../api/stayService'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { CheckInResponse } from '../types/stay'
import type { ReactNode } from 'react'

vi.mock('../api/stayService', () => ({
  stayService: {
    checkIn: vi.fn(),
  },
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCheckIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('should call stayService.checkIn and return the response successfully', async () => {
    const mockResponse: CheckInResponse = {
      stayId: 'STAY-999',
      plate: '1234ABC',
      checkIn: '2026-07-27T20:00:00.000Z',
      status: 'IN_PROGRESS',
    }

    vi.mocked(stayService.checkIn).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useCheckIn(), { wrapper })

    result.current.mutate({ plate: '1234ABC', vehicleType: 'CAR' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(stayService.checkIn).toHaveBeenCalledWith({ plate: '1234ABC', vehicleType: 'CAR' })
    expect(result.current.data).toEqual(mockResponse)
  })

  it('should throw "No hay plazas libres" when API returns 409 error', async () => {
    const axios409Error = {
      isAxiosError: true,
      response: { status: 409 },
    }

    vi.mocked(stayService.checkIn).mockRejectedValueOnce(axios409Error)

    const { result } = renderHook(() => useCheckIn(), { wrapper })

    result.current.mutate({ plate: '9999XYZ' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('No hay plazas libres')
  })

  it('should throw the original error if it is not a 409 AxiosError', async () => {
    const genericError = new Error('Network Error')

    vi.mocked(stayService.checkIn).mockRejectedValueOnce(genericError)

    const { result } = renderHook(() => useCheckIn(), { wrapper })

    result.current.mutate({ plate: '5555DEF' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('Network Error')
  })
})
