import { adminLabels } from '../labels'
import type { VehicleType } from '../types/tariff'

export const DEFAULT_VEHICLE_TYPES: VehicleType[] = ['CAR', 'CAR_PMR', 'MOTORBIKE']

export function getVehicleTypeLabel(type: VehicleType | string): string {
  const { form } = adminLabels.tariffs
  switch (type) {
    case 'CAR':
      return form.types.car
    case 'CAR_PMR':
      return form.types.carPmr
    case 'MOTORBIKE':
      return form.types.motorbike
    default:
      return type
  }
}

export function getAvailableVehicleTypes(existingTypesFromTariffs?: VehicleType[]): VehicleType[] {
  const typesSet = new Set<VehicleType>([...DEFAULT_VEHICLE_TYPES, ...(existingTypesFromTariffs ?? [])])
  return Array.from(typesSet)
}
