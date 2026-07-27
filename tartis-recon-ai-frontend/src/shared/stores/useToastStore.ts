import { create } from 'zustand'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type?: ToastType
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'> & { id?: string }) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = toast.id ?? Math.random().toString(36).substring(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))
