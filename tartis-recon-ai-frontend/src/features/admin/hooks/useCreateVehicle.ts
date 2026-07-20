import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVehicle } from '../api/vehicles'
import type { CreateVehicleInput } from '../types/vehicle'

export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVehicleInput) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
