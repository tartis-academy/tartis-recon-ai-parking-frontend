import type { Stay, StayStatusFilter, StayVehicleTypeFilter } from '../types/stay'
import {
  Card,
  CardHeader,
  CardBody,
  StatusBadge,
  Pagination,
  LoadingSpinner,
  ErrorMessage,
} from '@/shared/ui'
import { adminLabels } from '../labels'
import { STAY_TABLE_COLUMNS_COUNT } from '../constants'
import {
  formatCheckIn,
  formatCheckOut,
  formatTotal,
  formatTariff,
  resolveStatusLabel,
  resolveVehicleTypeLabel,
  statusBadgeVariant,
  hasTicket,
} from '../utils/stayFormatters'
import { StayCard } from './StayCard'
import { StayTableEmptyState } from './StayTableEmptyState'
import { StayTableToolbar } from './StayTableToolbar'

interface StayTableProps {
  stays: Stay[]
  total: number
  page: number
  pageSize: number
  search: string
  status: StayStatusFilter
  vehicleType: StayVehicleTypeFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: StayStatusFilter) => void
  onVehicleTypeChange: (value: StayVehicleTypeFilter) => void
  onPaginationChange: (params: { page: number; pageSize: number }) => void
  onClearFilters: () => void
  onViewTicket?: (stayId: string) => void
  isLoading: boolean
  isError: boolean
}

export function StayTable({
  stays,
  total,
  page,
  pageSize,
  search,
  status,
  vehicleType,
  onSearchChange,
  onStatusChange,
  onVehicleTypeChange,
  onPaginationChange,
  onClearFilters,
  onViewTicket,
  isLoading,
  isError,
}: StayTableProps) {
  const labels = adminLabels.stays
  const hasActiveFilters = Boolean(search) || status !== 'ALL' || vehicleType !== 'ALL'

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
            {total} {labels.pagination.records}
          </span>
        </div>
        <StayTableToolbar
          search={search}
          status={status}
          vehicleType={vehicleType}
          onSearchChange={onSearchChange}
          onStatusChange={onStatusChange}
          onVehicleTypeChange={onVehicleTypeChange}
        />
      </CardHeader>

      <CardBody>
        <table className="hidden xl:table w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-app/50 border-b border-border-subtle text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-3 xl:p-4 2xl:p-5">{labels.tableHeaders.plate}</th>
              <th className="p-3 xl:p-4 2xl:p-5">{labels.tableHeaders.spot}</th>
              <th className="p-3 xl:p-4 2xl:p-5">{labels.tableHeaders.tariff}</th>
              <th className="p-3 xl:p-4 2xl:p-5">{labels.tableHeaders.checkIn}</th>
              <th className="p-3 xl:p-4 2xl:p-5">{labels.tableHeaders.checkOut}</th>
              <th className="p-3 xl:p-4 2xl:p-5">{labels.tableHeaders.total}</th>
              <th className="p-3 xl:p-4 2xl:p-5 text-center">{labels.tableHeaders.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {stays.map((stay) => (
              <tr key={stay.stayId} className="hover:bg-surface-row-hover/50 transition-colors duration-200 text-sm">
                <td className="p-3 xl:p-4 2xl:p-5 font-bold text-gray-200">{stay.plate}</td>
                <td className="p-3 xl:p-4 2xl:p-5 text-gray-300">{stay.spotId}</td>
                <td className="p-3 xl:p-4 2xl:p-5 text-gray-300">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface-panel border border-border-default text-gray-300 truncate max-w-[180px]">
                    {formatTariff(stay.tariffId)}
                  </span>
                </td>
                <td className="p-3 xl:p-4 2xl:p-5 text-gray-400">{formatCheckIn(stay.checkIn)}</td>
                <td className="p-3 xl:p-4 2xl:p-5 text-gray-400">{formatCheckOut(stay.checkOut, stay.status)}</td>
                <td className="p-3 xl:p-4 2xl:p-5 text-gray-300">{formatTotal(stay.totalAmount, stay.status)}</td>
                <td className="p-3 xl:p-4 2xl:p-5 text-center">
                  <StatusBadge variant={statusBadgeVariant[stay.status]}>
                    {resolveStatusLabel(stay.status)}
                  </StatusBadge>
                </td>
              </tr>
            ))}
            {stays.length === 0 && (
              <StayTableEmptyState
                hasActiveFilters={hasActiveFilters}
                labels={labels}
                onClearFilters={onClearFilters}
                colSpan={STAY_TABLE_COLUMNS_COUNT}
              />
            )}
          </tbody>
        </table>

        <div className="xl:hidden">
          {stays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stays.map((stay) => (
                <StayCard
                  key={stay.stayId}
                  plate={stay.plate}
                  spot={stay.spotId}
                  vehicleTypeLabel={stay.vehicleType ? resolveVehicleTypeLabel(stay.vehicleType) : stay.vehicleId}
                  tariff={formatTariff(stay.tariffId)}
                  checkIn={formatCheckIn(stay.checkIn)}
                  checkOut={formatCheckOut(stay.checkOut, stay.status)}
                  total={formatTotal(stay.totalAmount, stay.status)}
                  statusLabel={resolveStatusLabel(stay.status)}
                  statusVariant={statusBadgeVariant[stay.status]}
                  hasTicket={hasTicket(stay)}
                  labels={{
                    spot: labels.tableHeaders.spot,
                    tariff: labels.tableHeaders.tariff,
                    checkIn: labels.tableHeaders.checkIn,
                    checkOut: labels.tableHeaders.checkOut,
                    total: labels.tableHeaders.total,
                    viewTicket: labels.viewTicket,
                    viewTicketUnavailable: labels.viewTicketUnavailable,
                  }}
                  onViewTicket={onViewTicket ? () => onViewTicket(stay.stayId) : undefined}
                />
              ))}
            </div>
          ) : (
            <StayTableEmptyState
              hasActiveFilters={hasActiveFilters}
              labels={labels}
              onClearFilters={onClearFilters}
            />
          )}
        </div>
      </CardBody>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={onPaginationChange}
        labels={labels.pagination}
      />
    </Card>
  )
}
