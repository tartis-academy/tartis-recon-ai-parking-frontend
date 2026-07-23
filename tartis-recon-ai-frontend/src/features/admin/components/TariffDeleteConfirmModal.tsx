import { createPortal } from 'react-dom'
import { adminLabels } from '../labels'
import { Button, Icon } from '@/shared/ui'
import type { Tariff } from '../types/tariff'

interface TariffDeleteConfirmModalProps {
  tariff: Tariff
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function TariffDeleteConfirmModal({
  tariff,
  onClose,
  onConfirm,
  isPending,
}: TariffDeleteConfirmModalProps) {
  const { deleteModal } = adminLabels.tariffs

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 gap-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 border border-red-500/20">
            <Icon name="close" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{deleteModal.title}</h3>
            <p className="text-xs text-gray-400">
              ¿Estás seguro de que deseas eliminar la tarifa{' '}
              <strong className="text-white">{tariff.name}</strong>? {deleteModal.subtitle}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            {deleteModal.cancel}
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isPending}
            onClick={onConfirm}
            className="!bg-red-500 hover:!bg-red-600 !text-white"
          >
            {isPending ? deleteModal.processing : deleteModal.confirm}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
