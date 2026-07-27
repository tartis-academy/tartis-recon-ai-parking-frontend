import { describe, it, expect, vi, beforeEach } from 'vitest'
import { stayService } from './stayService'
import apiClient from '@/lib/api-client'
import type { CheckInResponse, CheckOutResponse } from '@/types/stay'

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn(),
  },
  apiClient: {
    post: vi.fn(),
  },
}))

describe('stayService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkIn', () => {
    it('should call POST /v1/stays/check-in with correct payload and return response data', async () => {
      const mockResponse: CheckInResponse = {
        entryTicketId: 'TICK-12345',
        stayId: 'STAY-999',
        issuedAt: '2026-07-27T20:00:00.000Z',
        licensePlate: '1234ABC',
        barcode: '*1234ABC*',
      }

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })

      const result = await stayService.checkIn({
        licensePlate: '1234ABC',
        vehicleType: 'CAR',
      })

      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(apiClient.post).toHaveBeenCalledWith('/v1/stays/check-in', {
        licensePlate: '1234ABC',
        vehicleType: 'CAR',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should propagate API errors when checkIn fails', async () => {
      const apiError = new Error('Parking lleno')
      vi.mocked(apiClient.post).mockRejectedValueOnce(apiError)

      await expect(
        stayService.checkIn({ licensePlate: '9999XYZ', vehicleType: 'CAR' }),
      ).rejects.toThrow('Parking lleno')
    })
  })

  describe('checkOut', () => {
    it('should call POST /v1/stays/check-out with correct payload and return response data', async () => {
      const mockResponse: CheckOutResponse = {
        stayId: 'STAY-999',
        licensePlate: '1234ABC',
        entryTime: '2026-07-27T18:00:00.000Z',
        exitTime: '2026-07-27T20:00:00.000Z',
        totalAmount: 15.5,
        currency: 'EUR',
        paid: true,
      }

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })

      const result = await stayService.checkOut({
        ticketIdOrPlate: '1234ABC',
      })

      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(apiClient.post).toHaveBeenCalledWith('/v1/stays/check-out', {
        ticketIdOrPlate: '1234ABC',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should propagate API errors when checkOut fails', async () => {
      const apiError = new Error('Ticket no encontrado')
      vi.mocked(apiClient.post).mockRejectedValueOnce(apiError)

      await expect(
        stayService.checkOut({ ticketIdOrPlate: 'INVALID' }),
      ).rejects.toThrow('Ticket no encontrado')
    })
  })
})
