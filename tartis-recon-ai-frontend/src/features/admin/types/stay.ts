export type StayStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'PAY_PENDING' | 'PAID'

export interface Stay {
  id: string
  vehicleId: string
  spotId: string
  tariffId: string
  checkIn: string
  checkOut: string | null
  totalAmount: number | null
  status: StayStatus
  vehicle: { plate: string }
  spot: { code: string }
  tariff: { name: string; rate: number }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type StayStatusFilter = 'ALL' | StayStatus

export interface StayFilters {
  search?: string
  status?: Exclude<StayStatusFilter, 'ALL'>
}
