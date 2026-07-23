import { StatusBadge } from '@/shared/ui'

interface StayCardProps {
  plate: string
  spot: string
  tariff: string
  checkIn: string
  checkOut: string
  total: string
  statusLabel: string
  statusVariant: 'inProgress' | 'finished' | 'unavailable'
  labels: Record<'spot' | 'tariff' | 'checkIn' | 'checkOut' | 'total', string>
}

export function StayCard({
  plate,
  spot,
  tariff,
  checkIn,
  checkOut,
  total,
  statusLabel,
  statusVariant,
  labels,
}: StayCardProps) {
  return (
    <article className="bg-surface-card border border-border-subtle rounded-xl p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-200">{plate}</h3>
        <StatusBadge variant={statusVariant}>{statusLabel}</StatusBadge>
      </header>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">{labels.spot}</dt>
          <dd className="text-gray-200 mt-1">{spot}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">{labels.tariff}</dt>
          <dd className="text-gray-200 mt-1 truncate">{tariff}</dd>
        </div>
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
          <dd className="text-gray-200 mt-1">{total}</dd>
        </div>
      </dl>
    </article>
  )
}
