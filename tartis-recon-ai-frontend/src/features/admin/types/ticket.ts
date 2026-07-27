import type { PaginatedResponse } from './stay'

export interface Ticket {
  uniqueId: string
  stayId: string
  issuedAt: string
  totalAmount: number
}

export type TicketSortField = 'uniqueId' | 'stayId' | 'issuedAt' | 'totalAmount'
export type SortOrder = 'asc' | 'desc'

export interface TicketFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: TicketSortField
  sortOrder?: SortOrder
}

export type { PaginatedResponse }
