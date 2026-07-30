import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateVehicle, deactivateVehicle } from '../api/vehicles'
import type { Vehicle } from '../types/vehicle'

export const useToggleVehicleStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vehicleOrId: Vehicle | string) => {
      if (typeof vehicleOrId === 'string') {
        return deactivateVehicle(vehicleOrId)
      }
      const id = vehicleOrId.id || vehicleOrId.uniqueId || ''
      return vehicleOrId.active ? deactivateVehicle(id) : activateVehicle(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export const useActivateVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activateVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export const useDeactivateVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deactivateVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
