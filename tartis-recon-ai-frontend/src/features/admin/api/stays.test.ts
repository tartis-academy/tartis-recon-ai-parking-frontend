import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStays, clearVehicleMapCache } from './stays'
import apiClient from '@/lib/api-client'
import { getVehicles } from './vehicles'
import type { Stay } from '../types/stay'
import type { SpringPageResponse } from '@/lib/pagination'
import type { Vehicle } from '../types/vehicle'

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('./vehicles', () => ({
  getVehicles: vi.fn(),
}))

const baseStay: Stay = {
  stayId: 'stay-1',
  plate: '1234ABC',
  vehicleId: 'veh-1',
  spotId: 'spot-1',
  tariffId: 'trf-1',
  checkIn: '2026-01-01T10:00:00Z',
  checkOut: null,
  totalAmount: null,
  status: 'IN_PROGRESS',
}

function pageOf(content: Stay[]): SpringPageResponse<Stay> {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    size: 10,
    number: 0,
    numberOfElements: content.length,
    first: true,
    last: true,
    empty: content.length === 0,
  }
}

describe('stays API client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearVehicleMapCache()
  })

  it('requests a 0-indexed backend page with size and filters', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([baseStay]) })

    await getStays(2, 25, { search: 'ABC' })

    expect(apiClient.get).toHaveBeenCalledWith('/v1/stays', {
      params: { page: 1, size: 25, search: 'ABC' },
    })
  })

  it('normalizes the paginated response', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([baseStay]) })

    const result = await getStays(1, 10, {})

    expect(result).toEqual(
      expect.objectContaining({
        content: [baseStay],
        totalElements: 1,
        page: 1,
        size: 10,
        totalPages: 1,
      }),
    )
  })

  it('does not look up vehicles when every stay already has a plate', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([baseStay]) })

    await getStays(1, 10, {})

    expect(getVehicles).not.toHaveBeenCalled()
  })

  it('fills in a missing plate from the vehicle map', async () => {
    const stayWithoutPlate: Stay = { ...baseStay, plate: '' }
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([stayWithoutPlate]) })
    vi.mocked(getVehicles).mockResolvedValueOnce([
      { uniqueId: 'veh-1', plate: '9999ZZZ' } as Vehicle,
    ])

    const result = await getStays(1, 10, {})

    expect(result.content[0].plate).toBe('9999ZZZ')
  })

  it('retries the vehicle map with a forced refresh when the id is missing from cache', async () => {
    const stayWithoutPlate: Stay = { ...baseStay, plate: '' }
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([stayWithoutPlate]) })
    vi.mocked(getVehicles)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ uniqueId: 'veh-1', plate: '9999ZZZ' } as Vehicle])

    const result = await getStays(1, 10, {})

    expect(getVehicles).toHaveBeenCalledTimes(2)
    expect(result.content[0].plate).toBe('9999ZZZ')
  })

  it('falls back to a truncated vehicleId when the vehicle map lookup fails', async () => {
    const stayWithoutPlate: Stay = { ...baseStay, plate: '', vehicleId: 'veh-abcdefghij' }
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([stayWithoutPlate]) })
    vi.mocked(getVehicles).mockRejectedValueOnce(new Error('network error'))

    const result = await getStays(1, 10, {})

    expect(result.content[0].plate).toBe('veh-abcd')
  })

  it('falls back to a truncated vehicleId when the vehicle is still not found after refresh', async () => {
    const stayWithoutPlate: Stay = { ...baseStay, plate: '', vehicleId: 'veh-abcdefghij' }
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: pageOf([stayWithoutPlate]) })
    vi.mocked(getVehicles).mockResolvedValue([])

    const result = await getStays(1, 10, {})

    expect(result.content[0].plate).toBe('veh-abcd')
  })

  it('reuses the cached vehicle map across calls within the TTL', async () => {
    const stayWithoutPlate: Stay = { ...baseStay, plate: '' }
    vi.mocked(apiClient.get).mockResolvedValue({ data: pageOf([stayWithoutPlate]) })
    vi.mocked(getVehicles).mockResolvedValue([{ uniqueId: 'veh-1', plate: '9999ZZZ' } as Vehicle])

    await getStays(1, 10, {})
    await getStays(1, 10, {})

    expect(getVehicles).toHaveBeenCalledTimes(1)
  })

  it('looks up vehicles again after clearVehicleMapCache', async () => {
    const stayWithoutPlate: Stay = { ...baseStay, plate: '' }
    vi.mocked(apiClient.get).mockResolvedValue({ data: pageOf([stayWithoutPlate]) })
    vi.mocked(getVehicles).mockResolvedValue([{ uniqueId: 'veh-1', plate: '9999ZZZ' } as Vehicle])

    await getStays(1, 10, {})
    clearVehicleMapCache()
    await getStays(1, 10, {})

    expect(getVehicles).toHaveBeenCalledTimes(2)
  })

  it('propagates an error when the stays request fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Failed to fetch stays'))

    await expect(getStays(1, 10, {})).rejects.toThrow('Failed to fetch stays')
  })
})
