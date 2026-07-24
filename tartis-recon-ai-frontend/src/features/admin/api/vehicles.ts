import apiClient from '@/lib/api-client'
import type { Vehicle, CreateVehicleInput } from '../types/vehicle'

function toVehicleList(payload: unknown): Vehicle[] {
  if (Array.isArray(payload)) {
    return payload as Vehicle[]
  }

  if (
    payload !== null &&
    typeof payload === 'object' &&
    'data' in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: Vehicle[] }).data
  }

  return []
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get<unknown>('/v1/vehicles')
  return toVehicleList(response.data)
}

export const createVehicle = async (data: CreateVehicleInput): Promise<Vehicle> => {
  const response = await apiClient.post<Vehicle>('/v1/vehicles', data)
  return response.data
}

export const deactivateVehicle = async (uniqueId: string): Promise<void> => {
  await apiClient.patch(`/v1/vehicles/${uniqueId}/status`)
}