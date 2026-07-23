import type { Stay, StayStatus, StayStatusFilter } from '../types/stay'
import { Card, CardHeader, CardBody, StatusBadge, EmptyState, TextInput, Select, Icon, Pagination, LoadingSpinner, ErrorMessage } from '@/shared/ui'
import { adminLabels } from '../labels'

interface StayTableProps {
  stays: Stay[]
  total: number
  page: number
  pageSize: number
  search: string
  status: StayStatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: StayStatusFilter) => void
  onPaginationChange: (params: { page: number; pageSize: number }) => void
  isLoading: boolean
  isError: boolean
}

const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

const statusBadgeVariant: Record<StayStatus, 'inProgress' | 'finished' | 'unavailable'> = {
  IN_PROGRESS: 'inProgress',
  FINISHED: 'finished',
  CANCELLED: 'unavailable',
  PAY_PENDING: 'inProgress',
  PAID: 'finished',
}

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return dateTimeFormatter.format(new Date(value))
}

function formatTotal(value: number | null): string {
  if (value === null) return '—'
  return currencyFormatter.format(value)
}

export function StayTable({
  stays,
  total,
  page,
  pageSize,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onPaginationChange,
  isLoading,
  isError,
}: StayTableProps) {
  const labels = adminLabels.stays

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <LoadingSpinner />
          <p className="text-center text-gray-400 mt-4">{labels.loading}</p>
        </CardBody>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardBody>
          <ErrorMessage>{labels.error}</ErrorMessage>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">{labels.pageTitle}</h2>
          <span className="bg-surface-row-hover text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-border-default">
            {total} {labels.records}
          </span>
        </div>
      </CardHeader>

      <div className="p-5 border-b border-border-subtle bg-surface-card flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <TextInput
            icon={<Icon name="search" />}
            placeholder={labels.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            icon={<Icon name="filter" />}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as StayStatusFilter)}
            aria-label={labels.filterByStatus}
          >
            <option value="ALL">{labels.filterAll}</option>
            <option value="IN_PROGRESS">{labels.status.inProgress}</option>
            <option value="FINISHED">{labels.status.finished}</option>
            <option value="CANCELLED">{labels.status.cancelled}</option>
          </Select>
        </div>
      </div>

      <CardBody>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface-app/50 border-b border-border-subtle text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5">{labels.tableHeaders.plate}</th>
              <th className="p-5">{labels.tableHeaders.spot}</th>
              <th className="p-5">{labels.tableHeaders.tariff}</th>
              <th className="p-5">{labels.tableHeaders.checkIn}</th>
              <th className="p-5">{labels.tableHeaders.checkOut}</th>
              <th className="p-5">{labels.tableHeaders.total}</th>
              <th className="p-5 text-center">{labels.tableHeaders.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {stays.map((stay) => (
              <tr key={stay.id} className="hover:bg-surface-row-hover/50 transition-colors duration-200 text-sm">
                <td className="p-5 font-bold text-gray-200">{stay.vehicle.plate}</td>
                <td className="p-5 text-gray-300">{stay.spot.code}</td>
                <td className="p-5 text-gray-300">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface-panel border border-border-default text-gray-300">
                    {stay.tariff.name}
                  </span>
                </td>
                <td className="p-5 text-gray-400">{formatDateTime(stay.checkIn)}</td>
                <td className="p-5 text-gray-400">{formatDateTime(stay.checkOut)}</td>
                <td className="p-5 text-gray-300">{formatTotal(stay.totalAmount)}</td>
                <td className="p-5 text-center">
                  <StatusBadge variant={statusBadgeVariant[stay.status]}>
                    {labels.status[stay.status === 'IN_PROGRESS' ? 'inProgress' : stay.status === 'FINISHED' ? 'finished' : 'cancelled']}
                  </StatusBadge>
                </td>
              </tr>
            ))}
            {stays.length === 0 && (
              <EmptyState colSpan={7}>{search || status !== 'ALL' ? labels.noResults : labels.emptyState}</EmptyState>
            )}
          </tbody>
        </table>
      </CardBody>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={onPaginationChange}
      />
    </Card>
  )
}
