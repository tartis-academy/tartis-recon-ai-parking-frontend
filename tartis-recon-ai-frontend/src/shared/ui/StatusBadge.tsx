import type { ReactNode } from 'react'

interface StatusBadgeProps {
  variant: 'available' | 'occupied' | 'unavailable' | 'parked' | 'outside' | 'inProgress' | 'finished'
  children: ReactNode
}

const variants = {
  available: 'border-brand-500/30 bg-brand-soft text-brand-400',
  parked: 'border-brand-500/30 bg-brand-soft text-brand-400',
  occupied: 'border-state-occupied/30 bg-state-occupied/10 text-state-occupied',
  unavailable: 'border-state-unavailable/30 bg-state-unavailable/10 text-state-unavailable',
  outside: 'border-border-default bg-surface-panel text-gray-400',
  inProgress: 'border-brand-500/30 bg-brand-soft text-brand-400',
  finished: 'border-state-unavailable/30 bg-state-unavailable/10 text-gray-400',
}

const dots = {
  available: 'bg-brand-500',
  parked: 'bg-brand-500',
  occupied: 'bg-state-occupied',
  unavailable: 'bg-state-unavailable',
  outside: 'bg-border-default',
  inProgress: 'bg-brand-500',
  finished: 'bg-state-unavailable',
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`}></span>
      {children}
    </span>
  )
}
