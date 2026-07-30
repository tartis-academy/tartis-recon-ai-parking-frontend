import { create } from 'zustand'
import { DEFAULT_TOAST_DURATION_MS } from '../constants'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  title?: string
  type: ToastType
  timestamp: number
  duration?: number
}

export type AddToastPayload = Omit<ToastItem, 'id' | 'timestamp'> & {
  id?: string
}

interface ToastState {
  toasts: ToastItem[]
  addToast: (toast: AddToastPayload) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (payload) => {
    const id = payload.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newToast: ToastItem = {
      ...payload,
      id,
      timestamp: Date.now(),
      duration: payload.duration ?? DEFAULT_TOAST_DURATION_MS,
    }

    set((state) => ({
      toasts: [newToast, ...state.toasts].slice(0, 5), // Limitar a máximo 5 toasts simultáneos
    }))

    return id
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))
