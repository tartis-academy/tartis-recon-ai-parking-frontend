import type { Spot } from '../types/spot'
import { Card, CardHeader, CardBody, StatusBadge, EmptyState, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

interface SpotTableProps {
  spots: Spot[];
  onToggleMaintenance: (spot: Spot) => void;
}

export function SpotTable({ spots, onToggleMaintenance }: SpotTableProps) {
  const { tableHeaders, types, status, emptyState, records, legend, maintenance } = adminLabels.spots

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">{adminLabels.spots.pageTitle}</h2>
          <span className="bg-surface-row-hover text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-border-default">
            {spots.length} {records}
          </span>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface-app px-4 py-2 rounded-lg border border-border-subtle">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span> {legend.available}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface-app px-4 py-2 rounded-lg border border-border-subtle">
            <span className="w-2 h-2 rounded-full bg-state-occupied"></span> {legend.occupied}
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface-app/50 border-b border-border-subtle text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5">{tableHeaders.idNumber}</th>
              <th className="p-5">{tableHeaders.type}</th>
              <th className="p-5 text-center">{tableHeaders.status}</th>
              <th className="p-5 text-right w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {spots.map((spot) => (
              <tr key={spot.id} className="hover:bg-surface-row-hover/50 transition-colors duration-200 text-sm">
                <td className="p-5 font-bold text-gray-200">{spot.id}</td>
                <td className="p-5 text-gray-400">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface-panel border border-border-default text-gray-300">
                    {spot.type === 'CAR' ? types.standard : spot.type === 'CAR_PMR' ? types.disabled : types.motorbike}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <StatusBadge 
                    variant={
                      spot.status === 'AVAILABLE' ? 'available' : 
                      spot.status === 'OCCUPIED' ? 'occupied' : 'unavailable'
                    }
                  >
                    {spot.status === 'AVAILABLE' ? status.available : 
                     spot.status === 'OCCUPIED' ? status.occupied : status.unavailable}
                  </StatusBadge>
                </td>
                <td className="p-5 text-right">
                  {spot.status !== 'OCCUPIED' && (
                    <button
                      type="button"
                      onClick={() => onToggleMaintenance(spot)}
                      className="text-gray-500 hover:text-white p-2 rounded-md transition-colors hover:bg-surface-panel"
                      title={spot.status === 'AVAILABLE' ? maintenance.action : maintenance.restoreAction}
                    >
                      <Icon name="alert" className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {spots.length === 0 && (
              <EmptyState colSpan={4}>{emptyState}</EmptyState>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}
