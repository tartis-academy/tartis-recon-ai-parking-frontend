import axios, { AxiosError } from 'axios'
import { getDevToken, handleUnauthorized } from './keycloak'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipToast?: boolean
  }
}

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

export type ApiClientError = AxiosError<BackendErrorPayload> & ParsedApiError & {
  parsedError: ParsedApiError
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.MODE === 'test') {
    return config
  }
  return (async () => {
    if (!config.headers.Authorization) {
      const storedToken = localStorage.getItem('access_token')
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`
      } else if (import.meta.env.DEV) {
        const devToken = await getDevToken()
        if (devToken) {
          config.headers.Authorization = `Bearer ${devToken}`
        }
      }
    }
    return config
  })()
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorPayload>) => {
    const responseData = error?.response?.data
    const responseStatus = error?.response?.status

    if (responseStatus === 401) {
      handleUnauthorized()
    }

    const message =
      responseData?.message ||
      responseData?.error ||
      error?.message ||
      'Error en la petición'

    const parsedError: ParsedApiError = {
      timestamp: responseData?.timestamp,
      status: responseStatus ?? responseData?.status ?? 500,
      error: responseData?.error || error?.name || 'Error',
      message,
      path: responseData?.path,
    }

    const enrichedError = Object.assign(error ?? new Error(message), parsedError, { parsedError })

    return Promise.reject(enrichedError)
  },
)

export default apiClient
