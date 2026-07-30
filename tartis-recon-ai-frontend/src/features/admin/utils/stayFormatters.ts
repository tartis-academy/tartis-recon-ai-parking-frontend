import type { Stay, StayStatus } from '../types/stay'
import type { VehicleType } from '../types/vehicle'
import { adminLabels } from '../labels'
import { truncateId } from '@/shared/utils/truncateId'

const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

const rateFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
})

export const statusBadgeVariant: Record<StayStatus, 'inProgress' | 'finished' | 'unavailable'> = {
  IN_PROGRESS: 'inProgress',
  FINISHED: 'finished',
  CANCELLED: 'unavailable',
  PAY_PENDING: 'inProgress',
  PAID: 'finished',
}

export function formatCheckIn(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}

export function formatCheckOut(value: string | null, status: StayStatus): string {
  if (value) return dateTimeFormatter.format(new Date(value))
  const nullLabels = adminLabels.stays.nullValues
  if (status === 'IN_PROGRESS' || status === 'PAY_PENDING') return nullLabels.checkOutInProgress
  if (status === 'CANCELLED') return nullLabels.checkOutCancelled
  return nullLabels.checkOutMissing
}

export function formatTotal(value: number | null, status: StayStatus): string {
  if (value !== null) return currencyFormatter.format(value)
  const nullLabels = adminLabels.stays.nullValues
  if (status === 'IN_PROGRESS' || status === 'PAY_PENDING') return nullLabels.totalPending
  return nullLabels.totalNotApplicable
}

export function formatTariff(tariffId: string, rate?: number): string {
  const displayId = truncateId(tariffId)
  return rate !== undefined ? `${displayId} (${rateFormatter.format(rate)}/min)` : displayId
}

export function resolveStatusLabel(status: StayStatus): string {
  const labels = adminLabels.stays.status
  if (status === 'IN_PROGRESS' || status === 'PAY_PENDING') return labels.inProgress
  if (status === 'FINISHED' || status === 'PAID') return labels.finished
  return labels.cancelled
}

export function resolveVehicleTypeLabel(type: VehicleType): string {
  return adminLabels.stays.vehicleTypes[type] || type
}

// Heurística: se asume ticket disponible por estado porque el backend no expone
// un campo explícito. Migrar a un campo real (p.ej. `hasTicket`) cuando exista.
export function hasTicket(stay: Stay): boolean {
  return stay.status === 'FINISHED' || stay.status === 'PAID'
}
