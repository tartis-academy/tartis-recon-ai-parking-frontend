import { describe, it, expect, vi, beforeEach } from 'vitest'
import { stayService } from './stayService'
import apiClient from '@/lib/api-client'
import type { CheckInResponse, CheckOutResponse } from '../types/stay'

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn(),
  },
  apiClient: {
    post: vi.fn(),
  },
}))

const STAY_SERVICE_URL = import.meta.env.VITE_STAY_SERVICE_URL || '/v1/stays'

describe('stayService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkIn', () => {
    it('should call POST check-in endpoint with correct payload and return response data', async () => {
      const mockResponse: CheckInResponse = {
        stayId: 'STAY-999',
        plate: '1234ABC',
        checkIn: '2026-07-27T20:00:00.000Z',
        status: 'IN_PROGRESS',
        entryTicket: {
          ticketId: 'TICK-12345',
          barCode: '*1234ABC*',
          issuedAt: '2026-07-27T20:00:00.000Z',
        },
      }

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })

      const result = await stayService.checkIn({
        plate: '1234ABC',
        vehicleType: 'CAR',
      })

      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(apiClient.post).toHaveBeenCalledWith(`${STAY_SERVICE_URL}/check-in`, {
        plate: '1234ABC',
        vehicleType: 'CAR',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should propagate API errors when checkIn fails', async () => {
      const apiError = new Error('Parking lleno')
      vi.mocked(apiClient.post).mockRejectedValueOnce(apiError)

      await expect(
        stayService.checkIn({ plate: '9999XYZ', vehicleType: 'CAR' }),
      ).rejects.toThrow('Parking lleno')
    })
  })

  describe('checkOut', () => {
    it('should call POST check-out endpoint with correct payload and return response data', async () => {
      const mockResponse: CheckOutResponse = {
        stayId: 'STAY-999',
        plate: '1234ABC',
        checkIn: '2026-07-27T18:00:00.000Z',
        checkOut: '2026-07-27T20:00:00.000Z',
        totalMinutes: 120,
        amount: 15.5,
        status: 'FINISHED',
      }

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })

      const result = await stayService.checkOut({
        plate: '1234ABC',
      })

      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(apiClient.post).toHaveBeenCalledWith(`${STAY_SERVICE_URL}/check-out`, {
        plate: '1234ABC',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should propagate API errors when checkOut fails', async () => {
      const apiError = new Error('Estancia no encontrada')
      vi.mocked(apiClient.post).mockRejectedValueOnce(apiError)

      await expect(
        stayService.checkOut({ plate: 'INVALID' }),
      ).rejects.toThrow('Estancia no encontrada')
    })
  })
})
