import { useToastStore } from '@/shared/stores/useToastStore'
import { ErrorMessage } from '@/shared/ui'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          <ErrorMessage>{toast.message}</ErrorMessage>
        </div>
      ))}
    </div>
  )
}
