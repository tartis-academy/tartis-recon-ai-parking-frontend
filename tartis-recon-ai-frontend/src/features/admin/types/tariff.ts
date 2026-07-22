export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE'

export interface Tariff {
  id: string
  name: string
  vehicleType: VehicleType
  pricePerMinute: number
  description?: string
  active: boolean
}

export type CreateTariffInput = Omit<Tariff, 'id'>
