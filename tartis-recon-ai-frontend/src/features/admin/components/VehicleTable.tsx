import type { Vehicle } from '../types/vehicle'
import type { StatusFilter } from '../types/vehicle'
import { Card, CardHeader, CardBody, StatusBadge, EmptyState, TextInput, Select, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

interface VehicleTableProps {
  vehicles: Vehicle[]
  searchQuery: string
  onSearchChange: (val: string) => void
  statusFilter: StatusFilter
  onFilterChange: (val: StatusFilter) => void
  onToggleStatus: (vehicle: Vehicle) => void
}

export function VehicleTable({ 
  vehicles, 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onFilterChange,
  onToggleStatus,
}: VehicleTableProps) {
  const { 
    tableHeaders, 
    types, 
    status, 
    emptyState, 
    records, 
    searchPlaceholder,
    filterAll,
    actions,
  } = adminLabels.vehicles

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">{adminLabels.vehicles.pageTitle}</h2>
          <span className="bg-surface-row-hover text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-border-default">
            {vehicles.length} {records}
          </span>
        </div>
      </CardHeader>
      
      {/* Toolbar (Filters & Search) */}
      <div className="p-5 border-b border-border-subtle bg-surface-card flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <TextInput 
            icon={<Icon name="search" />}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select 
            icon={<Icon name="filter" />}
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value as 'ALL' | 'PARKED' | 'OUTSIDE')}
          >
            <option value="ALL">{filterAll}</option>
            <option value="PARKED">{status.parked}</option>
            <option value="OUTSIDE">{status.outside}</option>
          </Select>
        </div>
      </div>

      <CardBody>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface-app/50 border-b border-border-subtle text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5">{tableHeaders.id}</th>
              <th className="p-5">{tableHeaders.plate}</th>
              <th className="p-5">{tableHeaders.brandModel}</th>
              <th className="p-5">{tableHeaders.type}</th>
              <th className="p-5 text-center">{tableHeaders.status}</th>
              <th className="p-5 text-right w-16">{tableHeaders.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.uniqueId} className="hover:bg-surface-row-hover/50 transition-colors duration-200 text-sm">
                <td className="p-5 text-gray-500">VHC-{vehicle.uniqueId}</td>
                <td className="p-5 font-bold text-gray-200">{vehicle.plate}</td>
                <td className="p-5 text-gray-300">{vehicle.brand} {vehicle.model}</td>
                <td className="p-5 text-gray-400">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface-panel border border-border-default text-gray-300">
                    {vehicle.type === 'CAR' ? types.car : vehicle.type === 'CAR_PMR' ? types.carPmr : types.motorbike}
                  </span>
                </td>
                <td className="p-5 text-center">
                  {vehicle.isParked ? (
                    <StatusBadge variant="parked">{status.parked}</StatusBadge>
                  ) : (
                    <StatusBadge variant="outside">{status.outside}</StatusBadge>
                  )}
                  {!vehicle.active && (
                    <span className="ml-2 inline-block">
                      <StatusBadge variant="unavailable">{actions.inactive}</StatusBadge>
                    </span>
                  )}
                </td>
                <td className="p-5 text-right">
                  {!vehicle.isParked && (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(vehicle)}
                      className={`p-2 rounded-md transition-colors hover:bg-surface-panel ${
                        vehicle.active ? 'text-state-error hover:text-red-400' : 'text-brand-500 hover:text-brand-400'
                      }`}
                      title={vehicle.active ? actions.deactivate : actions.activate}
                      aria-label={vehicle.active ? actions.deactivate : actions.activate}
                    >
                      <Icon name={vehicle.active ? 'alert' : 'check'} className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <EmptyState colSpan={6}>{emptyState}</EmptyState>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}
