import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getStays } from '../api/stays'
import type { PaginatedResponse, Stay, StayFilters } from '../types/stay'

export function useStays(page: number, pageSize: number, filters: StayFilters) {
  return useQuery<PaginatedResponse<Stay>>({
    queryKey: ['stays', filters, page, pageSize],
    queryFn: () => getStays(page, pageSize, filters),
    placeholderData: keepPreviousData,
  })
}
