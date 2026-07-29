import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateVehicle } from '../api/vehicles'

export const useToggleVehicleStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (uniqueId: string) => deactivateVehicle(uniqueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
