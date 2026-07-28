export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE' | (string & {})

export interface Tariff {
  id: string
  name: string
  type: VehicleType
  basePrice: number
  pricePerMinute: number
  active: boolean
}

export type CreateTariffInput = Omit<Tariff, 'id'>
export type UpdateTariffInput = CreateTariffInput
