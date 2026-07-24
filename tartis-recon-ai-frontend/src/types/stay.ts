export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE'

export interface CheckInRequest {
  licensePlate: string
  vehicleType?: VehicleType
}

export interface CheckInResponse {
  entryTicketId: string
  stayId: string
  issuedAt: string
  licensePlate: string
  barcode?: string
}

export interface CheckOutRequest {
  ticketIdOrPlate: string
}

export interface CheckOutResponse {
  stayId: string
  licensePlate: string
  entryTime: string
  exitTime: string
  totalAmount: number
  currency: string
  paid: boolean
}
