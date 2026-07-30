import { create } from 'zustand'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type?: ToastType
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'> & { id?: string; duration?: number }) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const DEFAULT_TOAST_DURATION = 5000

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const currentToasts = get().toasts
    if (currentToasts.some((t) => t.message === toast.message)) {
      return
    }

    const id = toast.id ?? Math.random().toString(36).substring(2, 9)
    const duration = toast.duration ?? DEFAULT_TOAST_DURATION

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))
