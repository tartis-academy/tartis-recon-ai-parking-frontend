import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateVehicle, deactivateVehicle } from '../api/vehicles'
import { clearVehicleMapCache } from '../api/stays'
import { useToastStore } from '@/shared/stores/useToastStore'
import type { Vehicle } from '../types/vehicle'

export const useToggleVehicleStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      const id = vehicle.id || vehicle.uniqueId
      if (!id) {
        useToastStore.getState().addToast({
          message: 'No se pudo cambiar el estado: identificador de vehículo no válido',
          type: 'error',
        })
        return Promise.reject(new Error('Identificador de vehículo no válido'))
      }
      return vehicle.active ? deactivateVehicle(id) : activateVehicle(id)
    },
    onSuccess: () => {
      clearVehicleMapCache()
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['stays'] })
    },
  })
}

