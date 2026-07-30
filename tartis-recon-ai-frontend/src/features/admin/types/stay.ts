import type { VehicleType } from './vehicle'

export type StayStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'PAY_PENDING' | 'PAID'

export interface Stay {
  stayId: string
  plate: string
  vehicleId: string
  spotId: string
  tariffId: string
  checkIn: string
  checkOut: string | null
  totalAmount: number | null
  status: StayStatus
  vehicleType?: VehicleType
}

export type { PaginatedResponse } from '@/lib/pagination'

export type StayStatusFilter = 'ALL' | StayStatus
export type StayVehicleTypeFilter = 'ALL' | VehicleType

export interface StayFilters {
  search?: string
  status?: Exclude<StayStatusFilter, 'ALL'>
  vehicleType?: Exclude<StayVehicleTypeFilter, 'ALL'>
}
