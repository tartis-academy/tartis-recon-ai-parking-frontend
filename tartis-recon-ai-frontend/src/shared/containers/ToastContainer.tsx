import { useToastStore, type ToastType } from '@/shared/stores/useToastStore'
import { Icon } from '@/shared/ui'

const getToastStyles = (type: ToastType = 'error') => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-surface-card/95 border-emerald-500/50 text-emerald-300',
        icon: <Icon name="check-circle" className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
      }
    case 'info':
      return {
        bg: 'bg-surface-card/95 border-brand-500/50 text-brand-300',
        icon: <Icon name="document" className="w-5 h-5 text-brand-400 flex-shrink-0" />,
      }
    case 'warning':
      return {
        bg: 'bg-surface-card/95 border-amber-500/50 text-amber-300',
        icon: <Icon name="alert" className="w-5 h-5 text-amber-400 flex-shrink-0" />,
      }
    case 'error':
    default:
      return {
        bg: 'bg-surface-card/95 border-state-error/50 text-red-400',
        icon: <Icon name="alert" className="w-5 h-5 text-red-400 flex-shrink-0" />,
      }
  }
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map((toast) => {
        const style = getToastStyles(toast.type)
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            role="alert"
            className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer hover:opacity-90 animate-fade-in ${style.bg}`}
          >
            {style.icon}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              type="button"
              className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                removeToast(toast.id)
              }}
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
