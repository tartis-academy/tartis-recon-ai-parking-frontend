import { useQuery } from '@tanstack/react-query'
import { getStays } from '../api/stays'
import type { StayFilters } from '../types/stay'

export interface UseStaysOptions {
  refetchInterval?: number | false
}

export function useStays(page: number, pageSize: number, filters: StayFilters, options: UseStaysOptions = {}) {
  const { refetchInterval = false } = options
  return useQuery({
    queryKey: ['stays', page, pageSize, filters.search, filters.status, filters.vehicleType],
    queryFn: () => getStays(page, pageSize, filters),
    refetchInterval,
  })
}
