import { useState } from 'react'
import type { Tariff } from '../types/tariff'
import { Card, CardHeader, CardBody, StatusBadge, EmptyState, Button, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

interface TariffTableProps {
  tariffs: Tariff[]
  onToggleStatus: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  isToggling?: boolean
  isDeleting?: boolean
}

export function TariffTable({
  tariffs,
  onToggleStatus,
  onDelete,
  isToggling = false,
  isDeleting = false,
}: TariffTableProps) {
  const { tableHeaders, status, actions, emptyState, records, form } = adminLabels.tariffs
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getVehicleTypeLabel = (type: Tariff['type']) => {
    switch (type) {
      case 'CAR':
        return form.types.car
      case 'CAR_PMR':
        return form.types.carPmr
      case 'MOTORBIKE':
        return form.types.motorbike
      default:
        return type
    }
  }

  const handleDeleteConfirm = (id: string) => {
    onDelete(id)
    setDeletingId(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">{adminLabels.tariffs.pageTitle}</h2>
          <span className="bg-surface-row-hover text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-border-default">
            {tariffs.length} {records}
          </span>
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
              <tr
                key={tariff.id}
                className="hover:bg-surface-row-hover/50 transition-colors duration-200 text-sm"
              >
                <td className="p-5 font-bold text-gray-200">{tariff.name}</td>
                <td className="p-5 text-gray-400">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-surface-panel border border-border-default text-gray-300">
                    {getVehicleTypeLabel(tariff.type)}
                  </span>
                </td>
                <td className="p-5 text-gray-200 font-medium">
                  {tariff.basePrice.toFixed(2)} €
                </td>
                <td className="p-5 text-gray-200 font-medium">
                  {tariff.pricePerMinute.toFixed(2)} €/min
                </td>
                <td className="p-5 text-center">
                  {tariff.active ? (
                    <StatusBadge variant="available">{status.active}</StatusBadge>
                  ) : (
                    <StatusBadge variant="unavailable">{status.inactive}</StatusBadge>
                  )}
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botón Activar / Desactivar */}
                    <Button
                      variant={tariff.active ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={isToggling}
                      onClick={() => onToggleStatus(tariff.id, !tariff.active)}
                    >
                      {tariff.active ? actions.deactivate : actions.activate}
                    </Button>

                    {/* Botón Eliminar */}
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => setDeletingId(tariff.id)}
                      icon={<Icon name="close" className="w-3.5 h-3.5" />}
                    >
                      {actions.delete}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {tariffs.length === 0 && <EmptyState colSpan={6}>{emptyState}</EmptyState>}
          </tbody>
        </table>
      </CardBody>

      {/* Modal de confirmación de borrado */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">{actions.confirmDeleteTitle}</h3>
            <p className="text-sm text-gray-400">{actions.confirmDeleteMessage}</p>
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>
                {actions.cancel}
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={() => handleDeleteConfirm(deletingId)}
              >
                {actions.delete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
