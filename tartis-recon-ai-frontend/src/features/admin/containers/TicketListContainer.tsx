import { useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { TicketTable } from '../components/TicketTable'
import { PageHeader } from '@/shared/ui'
import { useDebounce } from '@/shared'
import { adminLabels } from '../labels'
import { DEFAULT_PAGE_SIZE } from '../constants'
import type { TicketSortField, SortOrder } from '../types/ticket'

export function TicketListContainer() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState<TicketSortField | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const debouncedSearch = useDebounce(search, 350)

  const filters = {
    search: debouncedSearch || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy,
    sortOrder: sortBy ? sortOrder : undefined,
  }

  const { data, isLoading, isError } = useTickets(page, pageSize, filters)

  const handlePaginationChange = (params: { page: number; pageSize: number }) => {
    setPage(params.page)
    setPageSize(params.pageSize)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDateFromChange = (value: string) => {
    setDateFrom(value)
    setPage(1)
  }

  const handleDateToChange = (value: string) => {
    setDateTo(value)
    setPage(1)
  }

  const handleSortChange = (field: TicketSortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setSortBy(undefined)
    setSortOrder('asc')
    setPage(1)
  }

  return (
    <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto animate-fade-in">
      <PageHeader
        title={adminLabels.tickets.pageTitle}
        subtitle={adminLabels.tickets.pageSubtitle}
      />
      <TicketTable
        tickets={data?.content ?? []}
        total={data?.totalElements ?? 0}
        page={data?.page ?? page}
        pageSize={data?.size ?? pageSize}
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onSortChange={handleSortChange}
        onPaginationChange={handlePaginationChange}
        onClearFilters={handleClearFilters}
        isLoading={isLoading && !data}
        isError={isError}
      />
    </div>
  )
}
