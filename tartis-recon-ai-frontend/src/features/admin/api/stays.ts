import apiClient from '@/lib/api-client'
import { normalizePageResponse, type SpringPageResponse } from '@/lib/pagination'
import type { PaginatedResponse, Stay, StayFilters } from '../types/stay'
import { getVehicles } from './vehicles'
let vehicleMapCache: Map<string, string> | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export function clearVehicleMapCache(): void {
  vehicleMapCache = null
  cacheTimestamp = 0
}

async function getVehicleMap(forceRefresh = false): Promise<Map<string, string>> {
  const now = Date.now()
  if (!forceRefresh && vehicleMapCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return vehicleMapCache
  }

  const vehicles = await getVehicles()
  const map = new Map<string, string>()
  vehicles.forEach((v) => {
    if (v.uniqueId && v.plate) {
      map.set(v.uniqueId, v.plate)
    }
    if (v.id && v.plate) {
      map.set(v.id, v.plate)
    }
  })
  vehicleMapCache = map
  cacheTimestamp = now
  return map
}

export const getStays = async (
  page: number,
  pageSize: number,
  filters: StayFilters,
): Promise<PaginatedResponse<Stay>> => {
  const backendPage = Math.max(0, page - 1)
  const response = await apiClient.get<SpringPageResponse<Stay>>('/v1/stays', {
    params: { page: backendPage, size: pageSize, ...filters },
  })
  const data = response.data

  let content = data?.content ?? []
  if (content.some((s) => !s.plate && s.vehicleId)) {
    try {
      let vehicleMap = await getVehicleMap()
      const missingInCache = content.some((s) => !s.plate && s.vehicleId && !vehicleMap.has(s.vehicleId))
      if (missingInCache) {
        vehicleMap = await getVehicleMap(true)
      }

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

  return normalizePageResponse({ ...data, content }, pageSize)
}
