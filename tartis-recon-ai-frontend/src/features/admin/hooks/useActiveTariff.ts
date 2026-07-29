import { useQuery } from '@tanstack/react-query'
import { getActiveTariff } from '../api/tariffs'
import type { VehicleType } from '../types/tariff'

export function useActiveTariff(vehicleType: VehicleType | null) {
  return useQuery({
    queryKey: ['tariffs', 'active', vehicleType],
    queryFn: () => getActiveTariff(vehicleType!),
    enabled: Boolean(vehicleType),
  })
}
