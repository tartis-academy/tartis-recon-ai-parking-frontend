import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getVehicles, createVehicle, updateVehicle, activateVehicle, deactivateVehicle } from './vehicles'
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
    it('should call GET /v1/vehicles and return list of vehicles', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [mockCar, mockMotorbike] })

      const result = await getVehicles()

      expect(apiClient.get).toHaveBeenCalledWith('/v1/vehicles')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(mockCar)
      expect(result[1]).toEqual(mockMotorbike)
    })

    it('should handle nested response format { data: [...] } from /v1/vehicles', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [mockCar] } })

      const result = await getVehicles()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockCar)
    })

    it('should return empty array if /v1/vehicles returns non-array and non-wrapper payload', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { invalidKey: 'invalidValue' } })

      const result = await getVehicles()

      expect(result).toEqual([])
    })

    it('should return empty array if /v1/vehicles returns null or non-object payload', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: null })

      const result = await getVehicles()

      expect(result).toEqual([])
    })

    it('should propagate error if /v1/vehicles fails', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Failed to fetch vehicles'))

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
      const createdVehicle: Vehicle = {
        id: 'v-1',
        uniqueId: 'uniq-1',
        active: true,
        type: 'CAR',
        plate: '1234ABC',
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        numDoors: 5,
        hasSidecar: false,
      }

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
      const updatedVehicle: Vehicle = {
        id: 'v-1',
        uniqueId: 'uniq-1',
        active: true,
        type: 'CAR',
        plate: '1234ABC',
        brand: 'Toyota',
        model: 'Corolla Hybrid',
        color: 'Blue',
        numDoors: 5,
        hasSidecar: false,
      }

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

  describe('activateVehicle & deactivateVehicle', () => {
    it('should call PATCH /v1/vehicles/{id}/status with active: true for activateVehicle', async () => {
      vi.mocked(apiClient.patch).mockResolvedValueOnce({})

      await activateVehicle('uniq-1')

      expect(apiClient.patch).toHaveBeenCalledTimes(1)
      expect(apiClient.patch).toHaveBeenCalledWith('/v1/vehicles/uniq-1/status', { active: true })
    })

    it('should call PATCH /v1/vehicles/{id}/status with active: false for deactivateVehicle', async () => {
      vi.mocked(apiClient.patch).mockResolvedValueOnce({})

      await deactivateVehicle('uniq-1')

      expect(apiClient.patch).toHaveBeenCalledTimes(1)
      expect(apiClient.patch).toHaveBeenCalledWith('/v1/vehicles/uniq-1/status', { active: false })
    })

    it('should propagate API error when deactivateVehicle fails', async () => {
      const error = new Error('Deactivation failed')
      vi.mocked(apiClient.patch).mockRejectedValueOnce(error)

      await expect(deactivateVehicle('uniq-1')).rejects.toThrow('Deactivation failed')
    })
  })
})
