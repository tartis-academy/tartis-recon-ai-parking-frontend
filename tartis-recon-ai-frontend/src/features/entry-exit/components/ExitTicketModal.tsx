import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { CheckOutResponse } from '../types/stay'
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

function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'
  return dateTimeFormatter.format(date)
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function ExitTicketModal({ ticket, onClose }: ExitTicketModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const isPaid = ticket.status === 'PAID'

  useEffect(() => {
    const dialogNode = dialogRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusable = dialogNode?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusable?.[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogNode) return

      const focusableElements = dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-ticket-modal-title"
        className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex justify-between items-start bg-surface-card">
          <div>
            <h2 id="exit-ticket-modal-title" className="text-xl font-bold text-white mb-1">
              Ticket de Salida
            </h2>
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
            <StatusBadge variant={isPaid ? 'finished' : 'inProgress'}>
              {isPaid ? 'Pagado' : 'Pendiente'}
            </StatusBadge>
          </div>

          <dl className="space-y-3 font-mono text-sm">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <dt className="text-gray-400">Matrícula</dt>
              <dd className="text-white font-bold tracking-widest">{ticket.plate}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <dt className="text-gray-400">Entrada</dt>
              <dd className="text-gray-300">{formatDateTime(ticket.checkIn)}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <dt className="text-gray-400">Salida</dt>
              <dd className="text-gray-300">{formatDateTime(ticket.checkOut)}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-400">ID Estancia</dt>
              <dd className="text-gray-300">{ticket.stayId}</dd>
            </div>
          </dl>

          <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
            <span className="text-gray-300 font-bold">Total a Cobrar</span>
            <span className="text-2xl font-extrabold text-white">
              {ticket.amount.toFixed(2)} EUR
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
