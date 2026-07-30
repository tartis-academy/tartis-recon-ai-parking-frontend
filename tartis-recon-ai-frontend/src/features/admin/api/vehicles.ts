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

export const updateVehicle = async (id: string, data: CreateVehicleInput): Promise<Vehicle> => {
  const response = await apiClient.put<Vehicle>(`/v1/vehicles/${id}`, data)
  return response.data
}

export const activateVehicle = async (id: string): Promise<void> => {
  await apiClient.patch(`/v1/vehicles/${id}/status`, { active: true })
}

export const deactivateVehicle = async (id: string): Promise<void> => {
  await apiClient.patch(`/v1/vehicles/${id}/status`, { active: false })
}