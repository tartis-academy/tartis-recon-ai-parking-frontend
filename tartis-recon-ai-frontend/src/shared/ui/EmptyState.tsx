import type { ReactNode } from 'react'

export function EmptyState({ children, colSpan }: { children: ReactNode; colSpan?: number }) {
  if (colSpan) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-8 text-center text-gray-500">
          {children}
        </td>
      </tr>
    )
  }
  return (
    <div className="p-8 text-center text-gray-500 border border-border-default rounded-xl bg-surface-panel">
      {children}
    </div>
  )
}
