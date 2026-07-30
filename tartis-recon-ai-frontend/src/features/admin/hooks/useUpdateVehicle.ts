import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateVehicle } from '../api/vehicles'
import { clearVehicleMapCache } from '../api/stays'
import type { CreateVehicleInput } from '../types/vehicle'

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateVehicleInput }) =>
      updateVehicle(id, data),
    onSuccess: () => {
      clearVehicleMapCache()
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['stays'] })
    },
  })
}

