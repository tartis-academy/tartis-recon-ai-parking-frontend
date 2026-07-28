import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '../api/vehicles'

export interface UseVehiclesOptions {
  refetchInterval?: number | false
}

export function useVehicles(options: UseVehiclesOptions = {}) {
  const { refetchInterval = false } = options
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    refetchInterval,
  })
}