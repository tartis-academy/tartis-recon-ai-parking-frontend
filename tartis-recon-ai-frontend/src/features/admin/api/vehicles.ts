import apiClient from '@/lib/api-client'
import type { Vehicle, CreateVehicleInput } from '../types/vehicle'
import type { PaginatedResponse, Stay } from '../types/stay'

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
  const [vehiclesRes, staysRes] = await Promise.all([
    apiClient.get<unknown>('/v1/vehicles'),
    apiClient.get<PaginatedResponse<Stay>>('/v1/stays', { 
      params: { status: 'IN_PROGRESS', size: 1000 },
      skipToast: true,
    }).catch(() => ({ data: { content: [] } as unknown as PaginatedResponse<Stay> })),
  ])
  
  const vehicles = toVehicleList(vehiclesRes.data)
  const activeStays = staysRes.data?.content || []
  
  const parkedPlates = new Set(activeStays.map((s) => s.plate))
  const parkedIds = new Set(activeStays.map((s) => s.vehicleId))

  return vehicles.map((v) => ({
    ...v,
    isParked: Boolean(parkedPlates.has(v.plate) || (v.uniqueId && parkedIds.has(v.uniqueId)) || (v.id && parkedIds.has(v.id))),
  }))
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