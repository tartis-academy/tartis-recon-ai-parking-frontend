import { createPortal } from 'react-dom'
import type { CheckOutResponse } from '@/types/stay'
import { Icon, Button, StatusBadge } from '@/shared/ui'

interface ExitTicketModalProps {
  ticket: CheckOutResponse
  onClose: () => void
}

const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function ExitTicketModal({ ticket, onClose }: ExitTicketModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex justify-between items-start bg-surface-card">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ticket de Salida</h2>
            <p className="text-xs text-gray-400">Resumen del check-out</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-white bg-surface-panel hover:bg-surface-row-hover p-1.5 rounded-md transition-colors border border-border-default flex-shrink-0"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Estado
            </span>
            <StatusBadge variant={ticket.paid ? 'available' : 'occupied'}>
              {ticket.paid ? 'Pagado' : 'Pendiente'}
            </StatusBadge>
          </div>

          <dl className="space-y-3 font-mono text-sm">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <dt className="text-gray-400">Matrícula</dt>
              <dd className="text-white font-bold tracking-widest">{ticket.licensePlate}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <dt className="text-gray-400">Entrada</dt>
              <dd className="text-gray-300">{dateTimeFormatter.format(new Date(ticket.entryTime))}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <dt className="text-gray-400">Salida</dt>
              <dd className="text-gray-300">{dateTimeFormatter.format(new Date(ticket.exitTime))}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-400">ID Estancia</dt>
              <dd className="text-gray-300">{ticket.stayId}</dd>
            </div>
          </dl>

          <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
            <span className="text-gray-300 font-bold">Total a Cobrar</span>
            <span className="text-2xl font-extrabold text-white">
              {ticket.totalAmount.toFixed(2)} {ticket.currency}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button type="button" variant="primary" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ExitTicketModal
