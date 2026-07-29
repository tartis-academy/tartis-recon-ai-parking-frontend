import axios from 'axios'
import { useToastStore } from '@/shared/stores/useToastStore'

export interface BackendErrorPayload {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
}

export interface ParsedApiError {
  timestamp?: string
  status: number
  error: string
  message: string
  path?: string
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error?.response?.data as BackendErrorPayload | undefined
    const responseStatus = error?.response?.status

    const message =
      responseData?.message ||
      responseData?.error ||
      error?.message ||
      'Error en la petición'

    const parsedError: ParsedApiError = {
      timestamp: responseData?.timestamp,
      status: responseData?.status ?? responseStatus ?? 500,
      error: responseData?.error || error?.name || 'Error',
      message,
      path: responseData?.path,
    }

    useToastStore.getState().addToast({
      message: parsedError.message,
      type: 'error',
    })

    return Promise.reject(parsedError)
  },
)

export default apiClient


