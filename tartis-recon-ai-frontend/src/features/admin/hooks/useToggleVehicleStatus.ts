import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateVehicle, deactivateVehicle } from '../api/vehicles'
import type { Vehicle } from '../types/vehicle'

export const useToggleVehicleStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vehicle: Vehicle) => {
      const id = vehicle.id || vehicle.uniqueId || ''
      return vehicle.active ? deactivateVehicle(id) : activateVehicle(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
