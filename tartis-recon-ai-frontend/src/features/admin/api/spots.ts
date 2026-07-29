import apiClient from '@/lib/api-client'
import type { Spot, SpotAvailability } from '../types/spot'
import type { VehicleType } from '../types/vehicle'

export const getSpots = async (): Promise<Spot[]> => {
  const { data } = await apiClient.get('/v1/spots')
  return data
}

export const updateSpotStatus = async (id: string, status: Spot['status']): Promise<Spot> => {
  const { data } = await apiClient.patch(`/v1/spots/${id}/status`, { status })
  return data
}

export const getSpotAvailability = async (
  vehicleType: VehicleType,
): Promise<SpotAvailability> => {
  const { data } = await apiClient.get<SpotAvailability>('/v1/spots/availability', {
    params: { type: vehicleType },
  })
  return data
}
