import type { Tariff } from '../types/tariff'
import { Card, CardHeader, CardBody, StatusBadge, EmptyState, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

interface TariffTableProps {
  tariffs: Tariff[]
  onToggleStatus?: (id: string, active: boolean) => void
  onDeleteRequest?: (tariff: Tariff) => void
}

export function TariffTable({ tariffs, onToggleStatus, onDeleteRequest }: TariffTableProps) {
  const { tableHeaders, actions, form, status, emptyState, records, legend } = adminLabels.tariffs

  const activeCount = tariffs.filter((t) => t.active).length
  const inactiveCount = tariffs.length - activeCount

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">{adminLabels.tariffs.pageTitle}</h2>
          <span className="bg-surface-row-hover text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-border-default">
            {tariffs.length} {records}
          </span>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface-app px-4 py-2 rounded-lg border border-border-subtle">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span> {legend.active} ({activeCount})
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface-app px-4 py-2 rounded-lg border border-border-subtle">
            <span className="w-2 h-2 rounded-full bg-state-unavailable"></span> {legend.inactive} ({inactiveCount})
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface-app/50 border-b border-border-subtle text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5">{tableHeaders.name}</th>
              <th className="p-5">{tableHeaders.vehicleType}</th>
              <th className="p-5">{tableHeaders.basePrice}</th>
              <th className="p-5">{tableHeaders.pricePerMinute}</th>
              <th className="p-5 text-center">{tableHeaders.status}</th>
              <th className="p-5 text-center">{tableHeaders.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {tariffs.map((tariff) => (
              <tr key={tariff.id} className="hover:bg-surface-row-hover/50 transition-colors duration-200 text-sm">
                <td className="p-5 font-bold text-gray-200">{tariff.name}</td>
                <td className="p-5 text-gray-400">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface-panel border border-border-default text-gray-300">
                    {tariff.vehicleType === 'CAR'
                      ? form.types.car
                      : tariff.vehicleType === 'CAR_PMR'
                      ? form.types.carPmr
                      : form.types.motorbike}
                  </span>
                </td>
                <td className="p-5 text-gray-300 font-medium">
                  {tariff.basePrice.toFixed(2)} €
                </td>
                <td className="p-5 text-brand-400 font-semibold">
                  {tariff.pricePerMinute.toFixed(2)} €/min
                </td>
                <td className="p-5 text-center">
                  <StatusBadge variant={tariff.active ? 'available' : 'unavailable'}>
                    {tariff.active ? status.active : status.inactive}
                  </StatusBadge>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Toggle Status Action */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(tariff.id, !tariff.active)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                        tariff.active
                          ? 'border-border-default text-gray-400 hover:text-amber-400 hover:border-amber-400/50 bg-surface-panel'
                          : 'border-brand-500/30 text-brand-400 hover:bg-brand-soft bg-brand-soft/5'
                      }`}
                      title={tariff.active ? actions.deactivate : actions.activate}
                    >
                      {tariff.active ? actions.deactivate : actions.activate}
                    </button>

                    {/* Delete Action */}
                    <button
                      type="button"
                      onClick={() => onDeleteRequest?.(tariff)}
                      aria-label={`${actions.delete} ${tariff.name}`}
                      className="p-1.5 rounded-lg border border-border-default text-gray-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
                      title={actions.delete}
                    >
                      <Icon name="close" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tariffs.length === 0 && (
              <EmptyState colSpan={6}>{emptyState}</EmptyState>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}
