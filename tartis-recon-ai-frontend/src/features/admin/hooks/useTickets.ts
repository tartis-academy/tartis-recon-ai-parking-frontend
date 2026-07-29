import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTickets } from '../api/tickets'
import type { TicketFilters } from '../types/ticket'

export function useTickets(page: number, pageSize: number, filters: TicketFilters) {
  return useQuery({
    queryKey: [
      'tickets',
      page,
      pageSize,
      filters.search,
      filters.dateFrom,
      filters.dateTo,
      filters.sortBy,
      filters.sortOrder,
    ],
    queryFn: () => getTickets(page, pageSize, filters),
    placeholderData: keepPreviousData,
  })
}
