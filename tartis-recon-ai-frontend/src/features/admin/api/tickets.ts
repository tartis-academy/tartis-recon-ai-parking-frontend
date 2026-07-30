import apiClient from '@/lib/api-client'
import type { PaginatedResponse, Ticket, TicketFilters } from '../types/ticket'

export const getTickets = async (
  page: number,
  pageSize: number,
  filters: TicketFilters,
): Promise<PaginatedResponse<Ticket>> => {
  const backendPage = Math.max(0, page - 1)
  const response = await apiClient.get<unknown>('/v1/tickets', {
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

  const data = (response.data || {}) as PaginatedResponse<Ticket>
  return {
    ...data,
    content: data.content ?? [],
    page: ((data as unknown as Record<string, unknown>).number as number ?? data.page ?? 0) + 1,
    size: data.size ?? pageSize,
    totalElements: data.totalElements ?? 0,
  }
}
