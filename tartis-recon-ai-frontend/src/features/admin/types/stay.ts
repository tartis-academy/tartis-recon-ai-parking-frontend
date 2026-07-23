import type { VehicleType } from './vehicle'

export type StayStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'PAY_PENDING' | 'PAID'

export interface StayVehicleSummary {
  plate: string
  type: VehicleType
}

export interface StaySpotSummary {
  code: string
}

export interface StayTariffSummary {
  name: string
  rate: number
}

/** Optional relations prepared for future ticket views */
export interface StayEntryTicketSummary {
  id: string
}

export interface StayTicketSummary {
  id: string
  totalAmount: number
}

export interface Stay {
  id: string
  vehicleId: string
  spotId: string
  tariffId: string
  checkIn: string
  checkOut: string | null
  totalAmount: number | null
  status: StayStatus
  vehicle: StayVehicleSummary
  spot: StaySpotSummary
  tariff: StayTariffSummary
  entryTicket?: StayEntryTicketSummary | null
  ticket?: StayTicketSummary | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type StayStatusFilter = 'ALL' | StayStatus
export type StayVehicleTypeFilter = 'ALL' | VehicleType

export interface StayFilters {
  search?: string
  status?: Exclude<StayStatusFilter, 'ALL'>
  vehicleType?: Exclude<StayVehicleTypeFilter, 'ALL'>
}
