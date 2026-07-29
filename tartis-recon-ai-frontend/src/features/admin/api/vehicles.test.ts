import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getVehicles, createVehicle, updateVehicle, deactivateVehicle } from './vehicles'
import apiClient from '@/lib/api-client'
import type { Vehicle, CreateVehicleInput } from '../types/vehicle'

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('vehicles API client', () => {
  const mockCar: Vehicle = {
    id: 'v-1',
    uniqueId: 'uniq-1',
    plate: '1234ABC',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Red',
    active: true,
    type: 'CAR',
    numDoors: 5,
    hasSidecar: false,
  }

  const mockMotorbike: Vehicle = {
    id: 'v-2',
    uniqueId: 'uniq-2',
    plate: '5678XYZ',
    brand: 'Honda',
    model: 'CBR',
    color: 'Black',
    active: true,
    type: 'MOTORBIKE',
    numDoors: 0,
    hasSidecar: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getVehicles', () => {
    it('should call GET /v1/vehicles and GET /v1/stays and map isParked status by plate', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: [mockCar, mockMotorbike] })
        }
        if (url === '/v1/stays') {
          return Promise.resolve({
            data: {
              content: [{ plate: '1234ABC', vehicleId: 'other-id' }],
            },
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(apiClient.get).toHaveBeenCalledWith('/v1/vehicles')
      expect(apiClient.get).toHaveBeenCalledWith('/v1/stays', {
        params: { status: 'IN_PROGRESS', size: 1000 },
        skipToast: true,
      })
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ ...mockCar, isParked: true })
      expect(result[1]).toEqual({ ...mockMotorbike, isParked: false })
    })

    it('should map isParked status by uniqueId or id', async () => {
      const vehicleWithIdOnly: Vehicle = {
        id: 'id-only',
        plate: '9999BBB',
        brand: 'Ford',
        model: 'Focus',
        color: 'Blue',
        active: true,
        type: 'CAR',
        numDoors: 5,
        hasSidecar: false,
      }

      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: [mockCar, vehicleWithIdOnly] })
        }
        if (url === '/v1/stays') {
          return Promise.resolve({
            data: {
              content: [
                { plate: 'UNMATCHED_PLATE', vehicleId: 'uniq-1' },
                { plate: 'UNMATCHED_PLATE_2', vehicleId: 'id-only' },
              ],
            },
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(result[0].isParked).toBe(true)
      expect(result[1].isParked).toBe(true)
    })

    it('should handle nested response format { data: [...] } from /v1/vehicles', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: { data: [mockCar] } })
        }
        if (url === '/v1/stays') {
          return Promise.resolve({ data: { content: [] } })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ ...mockCar, isParked: false })
    })

    it('should return empty array if /v1/vehicles returns non-array and non-wrapper payload', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: { invalidKey: 'invalidValue' } })
        }
        if (url === '/v1/stays') {
          return Promise.resolve({ data: { content: [] } })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(result).toEqual([])
    })

    it('should return empty array if /v1/vehicles returns null or non-object payload', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: null })
        }
        if (url === '/v1/stays') {
          return Promise.resolve({ data: { content: [] } })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(result).toEqual([])
    })

    it('should handle failure of /v1/stays gracefully and default activeStays to []', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: [mockCar] })
        }
        if (url === '/v1/stays') {
          return Promise.reject(new Error('Stays service error'))
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ ...mockCar, isParked: false })
    })

    it('should handle undefined content in /v1/stays response safely', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.resolve({ data: [mockCar] })
        }
        if (url === '/v1/stays') {
          return Promise.resolve({ data: {} })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const result = await getVehicles()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ ...mockCar, isParked: false })
    })

    it('should propagate error if /v1/vehicles fails', async () => {
      vi.mocked(apiClient.get).mockImplementation((url) => {
        if (url === '/v1/vehicles') {
          return Promise.reject(new Error('Failed to fetch vehicles'))
        }
        if (url === '/v1/stays') {
          return Promise.resolve({ data: { content: [] } })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      await expect(getVehicles()).rejects.toThrow('Failed to fetch vehicles')
    })
  })

  describe('createVehicle', () => {
    it('should call POST /v1/vehicles with input data and return created vehicle', async () => {
      const input: CreateVehicleInput = {
        plate: '1234ABC',
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        type: 'CAR',
        numDoors: 5,
        hasSidecar: false,
      }
      const createdVehicle: Vehicle = { id: 'v-1', uniqueId: 'uniq-1', active: true, ...input }

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: createdVehicle })

      const result = await createVehicle(input)

      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(apiClient.post).toHaveBeenCalledWith('/v1/vehicles', input)
      expect(result).toEqual(createdVehicle)
    })

    it('should propagate API error when createVehicle fails', async () => {
      const input: CreateVehicleInput = {
        plate: 'INVALID',
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        type: 'CAR',
        numDoors: 5,
        hasSidecar: false,
      }
      const error = new Error('Vehicle creation failed')
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      await expect(createVehicle(input)).rejects.toThrow('Vehicle creation failed')
    })
  })

  describe('updateVehicle', () => {
    it('should call PUT /v1/vehicles/{id} with input data and return updated vehicle', async () => {
      const input: CreateVehicleInput = {
        plate: '1234ABC',
        brand: 'Toyota',
        model: 'Corolla Hybrid',
        color: 'Blue',
        type: 'CAR',
        numDoors: 5,
        hasSidecar: false,
      }
      const updatedVehicle: Vehicle = { id: 'v-1', uniqueId: 'uniq-1', active: true, ...input }

      vi.mocked(apiClient.put).mockResolvedValueOnce({ data: updatedVehicle })

      const result = await updateVehicle('v-1', input)

      expect(apiClient.put).toHaveBeenCalledTimes(1)
      expect(apiClient.put).toHaveBeenCalledWith('/v1/vehicles/v-1', input)
      expect(result).toEqual(updatedVehicle)
    })

    it('should propagate API error when updateVehicle fails', async () => {
      const input: CreateVehicleInput = {
        plate: '1234ABC',
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        type: 'CAR',
        numDoors: 5,
        hasSidecar: false,
      }
      const error = new Error('Vehicle update failed')
      vi.mocked(apiClient.put).mockRejectedValueOnce(error)

      await expect(updateVehicle('v-1', input)).rejects.toThrow('Vehicle update failed')
    })
  })

  describe('deactivateVehicle', () => {
    it('should call PATCH /v1/vehicles/{uniqueId}/status', async () => {
      vi.mocked(apiClient.patch).mockResolvedValueOnce({})

      await deactivateVehicle('uniq-1')

      expect(apiClient.patch).toHaveBeenCalledTimes(1)
      expect(apiClient.patch).toHaveBeenCalledWith('/v1/vehicles/uniq-1/status')
    })

    it('should propagate API error when deactivateVehicle fails', async () => {
      const error = new Error('Deactivation failed')
      vi.mocked(apiClient.patch).mockRejectedValueOnce(error)

      await expect(deactivateVehicle('uniq-1')).rejects.toThrow('Deactivation failed')
    })
  })
})
