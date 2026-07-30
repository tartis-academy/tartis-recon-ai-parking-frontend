import apiClient from '@/lib/api-client'
import { normalizePageResponse, type SpringPageResponse } from '@/lib/pagination'
import type { PaginatedResponse, Ticket, TicketFilters } from '../types/ticket'
export const getTickets = async (
  page: number,
  pageSize: number,
  filters: TicketFilters,
): Promise<PaginatedResponse<Ticket>> => {
  const backendPage = Math.max(0, page - 1)
  const response = await apiClient.get<SpringPageResponse<Ticket> | Ticket[]>('/v1/tickets', {
    params: { page: backendPage, size: pageSize, ...filters },
  })
  
  if (Array.isArray(response.data)) {
    return {
      content: response.data,
      page: 1,
      size: pageSize,
      totalElements: response.data.length,
      totalPages: 1,
    }
  }

  return normalizePageResponse(response.data as Partial<SpringPageResponse<Ticket>>, pageSize)
}
