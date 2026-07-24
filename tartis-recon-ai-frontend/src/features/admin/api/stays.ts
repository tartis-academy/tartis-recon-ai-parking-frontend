import apiClient from '@/lib/api-client'
import type { PaginatedResponse, Stay, StayFilters } from '../types/stay'

export const getStays = async (
  page: number,
  pageSize: number,
  filters: StayFilters,
): Promise<PaginatedResponse<Stay>> => {
  const response = await apiClient.get<PaginatedResponse<Stay>>('/v1/stays', {
    params: { page, pageSize, ...filters },
  })
  return response.data
}
