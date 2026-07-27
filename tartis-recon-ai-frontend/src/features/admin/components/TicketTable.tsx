import type { Ticket, TicketSortField, SortOrder } from '../types/ticket'
import {
  Card,
  CardBody,
  Pagination,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  Icon,
} from '@/shared/ui'
import { adminLabels } from '../labels'
import { TicketTableToolbar } from './TicketTableToolbar'

interface TicketTableProps {
  tickets: Ticket[]
  total: number
  page: number
  pageSize: number
  search: string
  dateFrom: string
  dateTo: string
  sortBy?: TicketSortField
  sortOrder?: SortOrder
  onSearchChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onSortChange: (field: TicketSortField) => void
  onPaginationChange: (params: { page: number; pageSize: number }) => void
  onClearFilters: () => void
  isLoading: boolean
  isError: boolean
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

function formatDate(isoString: string): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return isNaN(date.getTime()) ? isoString : date.toLocaleString('es-ES')
}

export function TicketTable({
  tickets,
  total,
  page,
  pageSize,
  search,
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onPaginationChange,
  onClearFilters,
  isLoading,
  isError,
}: TicketTableProps) {
  const labels = adminLabels.tickets
  const hasActiveFilters = Boolean(search || dateFrom || dateTo || sortBy)

  const getAriaSort = (field: TicketSortField): 'ascending' | 'descending' | 'none' => {
    if (sortBy !== field) return 'none'
    return sortOrder === 'asc' ? 'ascending' : 'descending'
  }

  const renderSortIcon = (field: TicketSortField) => {
    if (sortBy !== field) {
      return <span className="text-xs opacity-40 group-hover:opacity-100 font-mono">↕</span>
    }
    return (
      <Icon
        name="chevron-right"
        className={`w-3.5 h-3.5 text-brand-400 transition-transform ${
          sortOrder === 'asc' ? '-rotate-90' : 'rotate-90'
        }`}
      />
    )
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <TicketTableToolbar
        total={total}
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={onSearchChange}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        onClearFilters={onClearFilters}
      />
      <CardBody className="p-0 flex-1 overflow-x-auto">
        {isLoading && !tickets.length ? (
          <div className="p-12 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorMessage>{labels.error}</ErrorMessage>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState>
              {hasActiveFilters ? labels.noResults : labels.emptyState}
            </EmptyState>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-panel border-b border-border-subtle text-xs font-semibold text-gray-400 uppercase tracking-wider select-none">
                <th className="py-3.5 px-5" aria-sort={getAriaSort('id')}>
                  <button
                    type="button"
                    onClick={() => onSortChange('id')}
                    className="flex items-center gap-2 group hover:text-white"
                  >
                    <span>{labels.tableHeaders.uniqueId}</span>
                    {renderSortIcon('id')}
                  </button>
                </th>
                <th className="py-3.5 px-5" aria-sort={getAriaSort('stayId')}>
                  <button
                    type="button"
                    onClick={() => onSortChange('stayId')}
                    className="flex items-center gap-2 group hover:text-white"
                  >
                    <span>{labels.tableHeaders.stayId}</span>
                    {renderSortIcon('stayId')}
                  </button>
                </th>
                <th className="py-3.5 px-5" aria-sort={getAriaSort('issuedAt')}>
                  <button
                    type="button"
                    onClick={() => onSortChange('issuedAt')}
                    className="flex items-center gap-2 group hover:text-white"
                  >
                    <span>{labels.tableHeaders.issuedAt}</span>
                    {renderSortIcon('issuedAt')}
                  </button>
                </th>
                <th className="py-3.5 px-5" aria-sort={getAriaSort('totalAmount')}>
                  <button
                    type="button"
                    onClick={() => onSortChange('totalAmount')}
                    className="flex items-center gap-2 group hover:text-white ml-auto"
                  >
                    <span>{labels.tableHeaders.totalAmount}</span>
                    {renderSortIcon('totalAmount')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm text-gray-200">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-surface-row-hover transition-colors"
                >
                  <td className="py-4 px-5 font-mono text-brand-400 font-semibold">
                    {ticket.id}
                  </td>
                  <td className="py-4 px-5 font-mono text-gray-300">
                    {ticket.stayId}
                  </td>
                  <td className="py-4 px-5 text-gray-300">
                    {formatDate(ticket.issuedAt)}
                  </td>
                  <td className="py-4 px-5 text-right font-semibold text-brand-400">
                    {currencyFormatter.format(ticket.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>

      {total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onChange={onPaginationChange}
          labels={labels.pagination}
        />
      )}
    </Card>
  )
}
