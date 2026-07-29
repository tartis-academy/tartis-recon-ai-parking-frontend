import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'
import type { Vehicle } from '../types/vehicle'

interface VehicleStatusModalProps {
  isOpen: boolean
  vehicle: Vehicle | null
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

export function VehicleStatusModal({
  isOpen,
  vehicle,
  onConfirm,
  onCancel,
  isPending,
}: VehicleStatusModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onCancel()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isPending, onCancel])

  if (!isOpen || !vehicle) return null

  const { actions } = adminLabels.vehicles
  const isActive = vehicle.active

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-start gap-4 bg-surface-card">
          <div className={`p-3 rounded-full flex-shrink-0 ${isActive ? 'bg-state-error/10 text-state-error' : 'bg-brand-500/10 text-brand-500'}`}>
            <Icon name={isActive ? 'alert' : 'check'} className="w-6 h-6" />
          </div>
          <div className="flex-1 pt-1">
            <h2 id="modal-title" className="text-xl font-bold text-white mb-2">
              {isActive ? actions.confirmDeactivateTitle : actions.confirmActivateTitle}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {isActive ? actions.confirmDeactivateMessage : actions.confirmActivateMessage}
            </p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="px-6 py-4 bg-surface-app/50 border-b border-border-subtle flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-400">{actions.selectedVehicle}</span>
          <span className="px-3 py-1 bg-surface-panel rounded border border-border-default font-mono text-sm text-gray-200">
            {vehicle.plate}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="p-4 flex items-center justify-end gap-3 bg-surface-card">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            {actions.cancel}
          </Button>
          <Button
            type="button"
            variant={isActive ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isPending}
            icon={!isPending ? <Icon name="check" className="w-4 h-4" /> : undefined}
          >
            {isPending ? actions.processing : actions.confirm}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
