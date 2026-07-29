import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSpots, getSpotAvailability } from './spots'
import apiClient from '@/lib/api-client'
import type { Spot, SpotAvailability } from '../types/spot'

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
  apiClient: {
    get: vi.fn(),
  },
}))

describe('spots API client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSpots', () => {
    it('should call GET /v1/spots and return array of spots', async () => {
      const mockSpots: Spot[] = [{ id: '1', type: 'CAR', status: 'AVAILABLE' }]
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockSpots })

      const result = await getSpots()

      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledWith('/v1/spots')
      expect(result).toEqual(mockSpots)
    })

    it('should propagate API errors when getSpots fails', async () => {
      const error = new Error('Network Error')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(getSpots()).rejects.toThrow('Network Error')
    })
  })

  describe('getSpotAvailability', () => {
    it('should call GET /v1/spots/availability with type query param and return availability', async () => {
      const mockAvailability: SpotAvailability = {
        type: 'CAR',
        available: true,
        availableCount: 7,
        totalCount: 20,
      }
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockAvailability })

      const result = await getSpotAvailability('CAR')

      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledWith('/v1/spots/availability', {
        params: { type: 'CAR' },
      })
      expect(result).toEqual(mockAvailability)
    })

    it('should return unavailable state when there are no free spots for the type', async () => {
      const mockAvailability: SpotAvailability = {
        type: 'MOTORBIKE',
        available: false,
        availableCount: 0,
        totalCount: 5,
      }
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockAvailability })

      const result = await getSpotAvailability('MOTORBIKE')

      expect(result).toEqual(mockAvailability)
    })

    it('should propagate API errors when getSpotAvailability fails', async () => {
      const error = new Error('Server Error')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(getSpotAvailability('CAR_PMR')).rejects.toThrow('Server Error')
    })
  })
})
