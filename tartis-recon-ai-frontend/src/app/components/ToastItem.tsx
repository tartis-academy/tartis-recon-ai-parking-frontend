import { useEffect } from 'react'
import type { ToastItem as ToastItemType } from '../stores/toast-store'
import { notificationLabels } from '../labels'
import { Icon, type IconName } from '@/shared/ui'

interface ToastItemProps {
  toast: ToastItemType
  onClose: (id: string) => void
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  useEffect(() => {
    if (!toast.duration) return
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const getVariantStyles = (): {
    border: string
    badge: string
    iconName: IconName
  } => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-brand-500/40',
          badge: 'bg-brand-500/20 text-brand-400',
          iconName: 'check',
        }
      case 'error':
        return {
          border: 'border-state-error/40',
          badge: 'bg-state-error/20 text-state-error',
          iconName: 'alert',
        }
      case 'warning':
        return {
          border: 'border-state-warn/40',
          badge: 'bg-state-warn/20 text-state-warn',
          iconName: 'alert',
        }
      case 'info':
      default:
        return {
          border: 'border-border-default',
          badge: 'bg-surface-row-hover text-gray-300',
          iconName: 'info',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 w-80 max-w-full p-4 rounded-xl bg-surface-card border ${styles.border} shadow-xl backdrop-blur-sm transition-all duration-300 animate-fade-in`}
    >
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${styles.badge}`}
      >
        <Icon name={styles.iconName} className="w-3.5 h-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-xs font-semibold text-white truncate mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-gray-300 leading-relaxed break-words">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label={notificationLabels.closeToast}
        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-surface-row-hover shrink-0"
      >
        <Icon name="close" className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
