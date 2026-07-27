import apiClient from '@/lib/api-client'
import type { PaginatedResponse, Stay, StayFilters } from '../types/stay'
import { getVehicles } from './vehicles'

export const getStays = async (
  page: number,
  pageSize: number,
  filters: StayFilters,
): Promise<PaginatedResponse<Stay>> => {
  const backendPage = Math.max(0, page - 1)
  const response = await apiClient.get<PaginatedResponse<Stay>>('/v1/stays', {
    params: { page: backendPage, size: pageSize, ...filters },
  })
  const data = response.data

  let content = data?.content ?? []
  if (content.some((s) => !s.plate && s.vehicleId)) {
    try {
      const vehicles = await getVehicles()
      const vehicleMap = new Map<string, string>()
      vehicles.forEach((v) => {
        if (v.uniqueId && v.plate) {
          vehicleMap.set(v.uniqueId, v.plate)
        }
        const vWithId = v as unknown as { id?: string }
        if (vWithId.id && v.plate) {
          vehicleMap.set(vWithId.id, v.plate)
        }
      })
      content = content.map((s) => ({
        ...s,
        plate: s.plate || vehicleMap.get(s.vehicleId) || s.vehicleId.slice(0, 8),
      }))
    } catch {
      content = content.map((s) => ({
        ...s,
        plate: s.plate || s.vehicleId.slice(0, 8),
      }))
    }
  }

  return {
    ...data,
    content,
    page: (data?.page ?? 0) + 1,
    size: data?.size ?? pageSize,
    totalElements: data?.totalElements ?? 0,
  }
}
