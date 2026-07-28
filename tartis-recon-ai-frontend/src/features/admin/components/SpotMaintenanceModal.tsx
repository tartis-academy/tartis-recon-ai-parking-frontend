import { createPortal } from 'react-dom'
import { Button, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'
import type { Spot } from '../types/spot'

interface SpotMaintenanceModalProps {
  isOpen: boolean
  spot: Spot | null
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

export function SpotMaintenanceModal({
  isOpen,
  spot,
  onConfirm,
  onCancel,
  isPending,
}: SpotMaintenanceModalProps) {
  if (!isOpen || !spot) return null

  const { maintenance } = adminLabels.spots
  const isAvailable = spot.status === 'AVAILABLE'

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-start gap-4 bg-surface-card">
          <div className={`p-3 rounded-full flex-shrink-0 ${isAvailable ? 'bg-state-error/10 text-state-error' : 'bg-brand-500/10 text-brand-500'}`}>
            <Icon name="alert" className="w-6 h-6" />
          </div>
          <div className="flex-1 pt-1">
            <h2 className="text-xl font-bold text-white mb-2">
              {isAvailable ? maintenance.confirmTitle : maintenance.restoreTitle}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {isAvailable ? maintenance.confirmMessage : maintenance.restoreMessage}
            </p>
          </div>
        </div>

        {/* Spot Info */}
        <div className="px-6 py-4 bg-surface-app/50 border-b border-border-subtle flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-400">Plaza seleccionada:</span>
          <span className="px-3 py-1 bg-surface-panel rounded border border-border-default font-mono text-sm text-gray-200">
            {spot.id}
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
            {maintenance.cancel}
          </Button>
          <Button
            type="button"
            variant={isAvailable ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isPending}
            icon={!isPending ? <Icon name="check" className="w-4 h-4" /> : undefined}
          >
            {isPending ? maintenance.processing : maintenance.confirm}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
