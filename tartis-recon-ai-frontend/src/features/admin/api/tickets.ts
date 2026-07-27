import apiClient from '@/lib/api-client'
import type { PaginatedResponse, Ticket, TicketFilters } from '../types/ticket'

export const getTickets = async (
  page: number,
  pageSize: number,
  filters: TicketFilters,
): Promise<PaginatedResponse<Ticket>> => {
  const backendPage = Math.max(0, page - 1)
  const response = await apiClient.get<PaginatedResponse<Ticket>>('/v1/tickets', {
    params: { page: backendPage, size: pageSize, ...filters },
  })
  const data = response.data || {}
  return {
    ...data,
    content: data.content ?? [],
    page: (data.page ?? 0) + 1,
    size: data.size ?? pageSize,
    totalElements: data.totalElements ?? 0,
  }
}
