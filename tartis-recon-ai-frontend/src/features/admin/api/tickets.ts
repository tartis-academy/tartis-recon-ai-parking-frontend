import apiClient from '@/lib/api-client'
import type { PaginatedResponse, Ticket, TicketFilters } from '../types/ticket'

export const getTickets = async (
  page: number,
  pageSize: number,
  filters: TicketFilters,
): Promise<PaginatedResponse<Ticket>> => {
  const response = await apiClient.get<PaginatedResponse<Ticket>>('/v1/tickets', {
    params: { page, pageSize, ...filters },
  })
  return response.data
}
