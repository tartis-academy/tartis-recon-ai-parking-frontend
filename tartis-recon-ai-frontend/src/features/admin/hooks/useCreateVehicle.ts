import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVehicle } from '../api/vehicles'
import { clearVehicleMapCache } from '../api/stays'
import type { CreateVehicleInput } from '../types/vehicle'

export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVehicleInput) => createVehicle(data),
    onSuccess: () => {
      clearVehicleMapCache()
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['stays'] })
    },
  })
}
