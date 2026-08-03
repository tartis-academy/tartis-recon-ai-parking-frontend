import { Suspense, type ReactNode } from 'react'
import { RemoteErrorBoundary } from './RemoteErrorBoundary'
import { RemoteLoadingFallback } from './RemoteLoadingFallback'

interface RemoteSlotProps {
  children: ReactNode
  moduleName?: string
}

export function RemoteSlot({ children, moduleName }: RemoteSlotProps) {
  return (
    <RemoteErrorBoundary moduleName={moduleName}>
      <Suspense fallback={<RemoteLoadingFallback />}>
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  )
}
