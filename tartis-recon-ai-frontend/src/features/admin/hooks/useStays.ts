import { useQuery } from '@tanstack/react-query'
import { getStays } from '../api/stays'
import type { StayFilters } from '../types/stay'

export function useStays(page: number, pageSize: number, filters: StayFilters) {
  return useQuery({
    queryKey: ['stays', page, pageSize, filters.search, filters.status, filters.vehicleType],
    queryFn: () => getStays(page, pageSize, filters),
  })
}
