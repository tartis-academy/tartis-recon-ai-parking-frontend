import apiClient from '@/lib/api-client'
import type { Vehicle, CreateVehicleInput } from '../types/vehicle'

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get<Vehicle[]>('/v1/vehicles')
  return response.data
}

export const createVehicle = async (data: CreateVehicleInput): Promise<Vehicle> => {
  const response = await apiClient.post<Vehicle>('/v1/vehicles', data)
  return response.data
}