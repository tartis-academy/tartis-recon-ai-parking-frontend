import type { ReactNode } from 'react'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`bg-surface-card rounded-xl shadow-xl border border-border-subtle overflow-hidden ${className || ''}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`p-5 border-b border-border-subtle bg-surface-card flex flex-wrap gap-4 justify-between items-center ${className || ''}`}>
      {children}
    </div>
  )
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      {children}
    </div>
  )
}
