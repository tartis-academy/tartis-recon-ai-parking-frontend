export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE'

export interface CheckInRequest {
  plate: string
  vehicleType?: VehicleType
}

export interface EntryTicketResponse {
  ticketId: string
  barCode?: string
  issuedAt: string
}

export interface CheckInResponse {
  stayId: string
  plate: string
  spotId?: string
  checkIn: string
  status?: string
  entryTicket?: EntryTicketResponse
}

export interface CheckOutRequest {
  plate: string
}

export interface CheckOutResponse {
  stayId: string
  plate: string
  checkIn: string
  checkOut: string
  totalMinutes?: number
  amount: number
  ticketId?: string
  status: string
}
