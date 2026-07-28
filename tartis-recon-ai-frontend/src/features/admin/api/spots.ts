import { apiClient } from '@/lib/api-client'
import type { Spot } from '../types/spot'

export const getSpots = async (): Promise<Spot[]> => {
  const { data } = await apiClient.get('/v1/spots')
  return data
}

export const updateSpotStatus = async (id: string, status: Spot['status']): Promise<Spot> => {
  const { data } = await apiClient.patch(`/v1/spots/${id}/status`, { status })
  return data
}
