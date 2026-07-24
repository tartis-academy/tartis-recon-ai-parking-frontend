import type { Ticket, TicketSortField, SortOrder } from '../types/ticket'
import {
  Card,
  CardHeader,
  CardBody,
  Pagination,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  TextInput,
  Button,
  Icon,
} from '@/shared/ui'
import { adminLabels } from '../labels'

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
  const hasActiveFilters = Boolean(search || dateFrom || dateTo)

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
      <CardHeader className="flex flex-col gap-4 p-5 border-b border-border-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface-panel text-brand-400 border border-border-subtle">
              <Icon name="document" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{labels.pageTitle}</h2>
              <p className="text-xs text-gray-400">
                {total} {labels.records}
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <TextInput
              placeholder={labels.searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Bar: Date range */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border-subtle/50 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>{labels.dateFromLabel}</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="bg-surface-panel text-gray-200 border border-border-default rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span>{labels.dateToLabel}</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="bg-surface-panel text-gray-200 border border-border-default rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              {labels.clearFilters}
            </Button>
          )}
        </div>
      </CardHeader>

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
                <th className="py-3.5 px-5">
                  <button
                    type="button"
                    onClick={() => onSortChange('uniqueId')}
                    className="flex items-center gap-2 group hover:text-white"
                  >
                    <span>{labels.tableHeaders.uniqueId}</span>
                    {renderSortIcon('uniqueId')}
                  </button>
                </th>
                <th className="py-3.5 px-5">
                  <button
                    type="button"
                    onClick={() => onSortChange('stayId')}
                    className="flex items-center gap-2 group hover:text-white"
                  >
                    <span>{labels.tableHeaders.stayId}</span>
                    {renderSortIcon('stayId')}
                  </button>
                </th>
                <th className="py-3.5 px-5">
                  <button
                    type="button"
                    onClick={() => onSortChange('issuedAt')}
                    className="flex items-center gap-2 group hover:text-white"
                  >
                    <span>{labels.tableHeaders.issuedAt}</span>
                    {renderSortIcon('issuedAt')}
                  </button>
                </th>
                <th className="py-3.5 px-5">
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
                  key={ticket.uniqueId}
                  className="hover:bg-surface-row-hover transition-colors"
                >
                  <td className="py-4 px-5 font-mono text-brand-400 font-semibold">
                    {ticket.uniqueId}
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
