import { useQuery } from '@tanstack/react-query'
import { getSpots } from '../api/spots'

export interface UseSpotsOptions {
  refetchInterval?: number | false
}

export const useSpots = (options: UseSpotsOptions = {}) => {
  const { refetchInterval = false } = options
  return useQuery({
    queryKey: ['spots'],
    queryFn: getSpots,
    refetchInterval,
  })
}
