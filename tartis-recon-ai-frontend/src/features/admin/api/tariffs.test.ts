import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTariffs,
  getActiveTariff,
  createTariff,
  updateTariff,
  toggleTariffStatus,
  deleteTariff,
} from './tariffs'
import apiClient from '@/lib/api-client'
import type { Tariff, CreateTariffInput, UpdateTariffInput } from '../types/tariff'

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('tariffs API client', () => {
  const mockTariff: Tariff = {
    id: '1',
    name: 'Standard Car Tariff',
    type: 'CAR',
    basePrice: 2.5,
    pricePerMinute: 0.05,
    active: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTariffs', () => {
    it('should call GET /v1/tariffs and return array of tariffs', async () => {
      const mockTariffs = [mockTariff]
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockTariffs })

      const result = await getTariffs()

      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledWith('/v1/tariffs')
      expect(result).toEqual(mockTariffs)
    })

    it('should propagate API errors when getTariffs fails', async () => {
      const error = new Error('Network Error')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(getTariffs()).rejects.toThrow('Network Error')
    })
  })

  describe('getActiveTariff', () => {
    it('should call GET /v1/tariffs/active with type query param and return active tariff', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockTariff })

      const result = await getActiveTariff('CAR')

      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledWith('/v1/tariffs/active', {
        params: { type: 'CAR' },
      })
      expect(result).toEqual(mockTariff)
    })

    it('should handle array response format from backend and return active tariff object', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [mockTariff] })

      const result = await getActiveTariff('CAR')

      expect(result).toEqual(mockTariff)
    })

    it('should return null when getActiveTariff receives 404 Axios error', async () => {
      const axiosError = { isAxiosError: true, response: { status: 404 } }
      vi.mocked(apiClient.get).mockRejectedValueOnce(axiosError)

      const result = await getActiveTariff('CAR_PMR')

      expect(result).toBeNull()
    })

    it('should propagate API errors when getActiveTariff fails with non-404 error', async () => {
      const error = new Error('Server Error')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(getActiveTariff('CAR')).rejects.toThrow('Server Error')
    })
  })

  describe('createTariff', () => {
    it('should call POST /v1/tariffs with payload and return created tariff', async () => {
      const input: CreateTariffInput = {
        name: 'New Motorbike Tariff',
        type: 'MOTORBIKE',
        basePrice: 1.5,
        pricePerMinute: 0.03,
        active: true,
      }
      const createdTariff: Tariff = { id: '2', ...input }

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: createdTariff })

      const result = await createTariff(input)

      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(apiClient.post).toHaveBeenCalledWith('/v1/tariffs', input)
      expect(result).toEqual(createdTariff)
    })

    it('should propagate API errors when createTariff fails', async () => {
      const input: CreateTariffInput = {
        name: 'Invalid Tariff',
        type: 'CAR',
        basePrice: -1,
        pricePerMinute: 0,
        active: false,
      }
      const error = new Error('Bad Request')
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      await expect(createTariff(input)).rejects.toThrow('Bad Request')
    })
  })

  describe('updateTariff', () => {
    it('should call PUT /v1/tariffs/{id} with payload and return updated tariff', async () => {
      const input: UpdateTariffInput = {
        name: 'Updated Tariff Name',
        type: 'CAR',
        basePrice: 3.0,
        pricePerMinute: 0.06,
        active: true,
      }
      const updatedTariff: Tariff = { id: '1', ...input }

      vi.mocked(apiClient.put).mockResolvedValueOnce({ data: updatedTariff })

      const result = await updateTariff('1', input)

      expect(apiClient.put).toHaveBeenCalledTimes(1)
      expect(apiClient.put).toHaveBeenCalledWith('/v1/tariffs/1', input)
      expect(result).toEqual(updatedTariff)
    })

    it('should propagate API errors when updateTariff fails', async () => {
      const input: UpdateTariffInput = {
        name: 'Updated Tariff',
        type: 'CAR',
        basePrice: 3.0,
        pricePerMinute: 0.06,
        active: true,
      }
      const error = new Error('Tariff not found')
      vi.mocked(apiClient.put).mockRejectedValueOnce(error)

      await expect(updateTariff('999', input)).rejects.toThrow('Tariff not found')
    })
  })

  describe('toggleTariffStatus', () => {
    it('should call PATCH /v1/tariffs/{id}/status with active status payload', async () => {
      const toggledTariff: Tariff = { ...mockTariff, active: false }
      vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: toggledTariff })

      const result = await toggleTariffStatus('1', false)

      expect(apiClient.patch).toHaveBeenCalledTimes(1)
      expect(apiClient.patch).toHaveBeenCalledWith('/v1/tariffs/1/status', { active: false })
      expect(result).toEqual(toggledTariff)
    })

    it('should propagate API errors when toggleTariffStatus fails', async () => {
      const error = new Error('Forbidden')
      vi.mocked(apiClient.patch).mockRejectedValueOnce(error)

      await expect(toggleTariffStatus('1', true)).rejects.toThrow('Forbidden')
    })
  })

  describe('deleteTariff', () => {
    it('should call DELETE /v1/tariffs/{id}', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({})

      await deleteTariff('1')

      expect(apiClient.delete).toHaveBeenCalledTimes(1)
      expect(apiClient.delete).toHaveBeenCalledWith('/v1/tariffs/1')
    })

    it('should propagate API errors when deleteTariff fails', async () => {
      const error = new Error('Cannot delete active tariff')
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error)

      await expect(deleteTariff('1')).rejects.toThrow('Cannot delete active tariff')
    })
  })
})
