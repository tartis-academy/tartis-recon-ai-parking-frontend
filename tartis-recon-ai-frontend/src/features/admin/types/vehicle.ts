export interface VehicleBase {
  id?: string
  uniqueId?: string
  plate: string
  brand: string
  model: string
  color: string
  active: boolean
  isParked?: boolean
}

export interface Car extends VehicleBase {
  type: 'CAR' | 'CAR_PMR'
  numDoors: number
  hasSidecar: false
}

export interface Motorbike extends VehicleBase {
  type: 'MOTORBIKE'
  numDoors: 0
  hasSidecar: boolean
}

export type Vehicle = Car | Motorbike

export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE'

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'uniqueId' | 'active'>