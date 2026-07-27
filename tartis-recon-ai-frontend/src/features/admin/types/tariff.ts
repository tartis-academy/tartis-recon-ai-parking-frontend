export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE'

export interface Tariff {
  id: string
  name: string
  type: VehicleType
  basePrice: number
  pricePerMinute: number
  active: boolean
}

export type CreateTariffInput = Omit<Tariff, 'id'>
