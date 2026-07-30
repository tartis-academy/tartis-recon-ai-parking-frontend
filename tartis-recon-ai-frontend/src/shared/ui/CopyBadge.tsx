import { useState } from 'react'
import { Icon } from './Icon'
import { useToastStore } from '@/shared/stores/useToastStore'
import { truncateId } from '@/shared/utils/truncateId'

interface CopyBadgeProps {
  value: string
  displayValue?: string
  title?: string
  className?: string
}

export function CopyBadge({ value, displayValue, title, className = '' }: CopyBadgeProps) {
  const [copied, setCopied] = useState(false)

  const formattedDisplay = displayValue || (value ? truncateId(value) : value)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (!value) return
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          useToastStore.getState().addToast({
            message: 'ID copiado al portapapeles',
            type: 'info',
          })
          setTimeout(() => setCopied(false), 2000)
        }).catch(() => {})
      }}
      title={title || `Copiar ID completo: ${value}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono bg-surface-panel border border-border-default text-gray-300 hover:text-white hover:border-gray-500 transition-colors cursor-pointer group ${className}`}
    >
      <span>{formattedDisplay}</span>
      <Icon
        name={copied ? 'check' : 'copy'}
        className={`w-3 h-3 transition-colors shrink-0 ${copied ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'}`}
      />
    </button>
  )
}
