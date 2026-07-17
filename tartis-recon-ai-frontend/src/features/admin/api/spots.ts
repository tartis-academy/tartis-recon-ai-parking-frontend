import { apiClient } from '@/lib/api-client'
import { Spot } from '../types/spot'

export const getSpots = async (): Promise<Spot[]> => {
  const { data } = await apiClient.get('/v1/spots')
  return data
}
