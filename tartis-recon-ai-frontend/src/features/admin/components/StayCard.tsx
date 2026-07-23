import { StatusBadge, Button } from '@/shared/ui'

interface StayCardLabels {
  spot: string
  tariff: string
  checkIn: string
  checkOut: string
  total: string
  viewTicket: string
  viewTicketUnavailable: string
}

interface StayCardProps {
  plate: string
  spot: string
  vehicleTypeLabel: string
  tariff: string
  checkIn: string
  checkOut: string
  total: string
  statusLabel: string
  statusVariant: 'inProgress' | 'finished' | 'unavailable'
  hasTicket: boolean
  labels: StayCardLabels
  onViewTicket?: () => void
}

export function StayCard({
  plate,
  spot,
  vehicleTypeLabel,
  tariff,
  checkIn,
  checkOut,
  total,
  statusLabel,
  statusVariant,
  hasTicket,
  labels,
  onViewTicket,
}: StayCardProps) {
  return (
    <article className="bg-surface-card border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-gray-200 truncate">{plate}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {labels.spot} {spot}
            <span className="mx-1.5 text-gray-600" aria-hidden="true">·</span>
            {vehicleTypeLabel}
          </p>
        </div>
        <StatusBadge variant={statusVariant}>{statusLabel}</StatusBadge>
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">{labels.checkIn}</dt>
          <dd className="text-gray-200 mt-1">{checkIn}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">{labels.checkOut}</dt>
          <dd className="text-gray-200 mt-1">{checkOut}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">{labels.total}</dt>
          <dd className="text-gray-200 mt-1 font-medium">{total}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">{labels.tariff}</dt>
          <dd className="text-gray-200 mt-1 truncate" title={tariff}>{tariff}</dd>
        </div>
      </dl>

      {onViewTicket && (
        <footer className="pt-1 border-t border-border-subtle">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={!hasTicket}
            onClick={onViewTicket}
            aria-label={hasTicket ? labels.viewTicket : labels.viewTicketUnavailable}
          >
            {labels.viewTicket}
          </Button>
        </footer>
      )}
    </article>
  )
}
