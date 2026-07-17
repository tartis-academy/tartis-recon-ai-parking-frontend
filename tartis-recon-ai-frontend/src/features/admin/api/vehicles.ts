import apiClient from '@/lib/api-client'
import type { Vehicle } from '../types/vehicle'

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get<Vehicle[]>('/v1/vehicles')
  return response.data
}