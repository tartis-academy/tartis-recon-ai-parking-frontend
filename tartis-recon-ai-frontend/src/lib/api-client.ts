import axios, { AxiosError } from 'axios'
import { useToastStore } from '@/shared/stores/useToastStore'

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

let cachedToken: { token: string; expiresAt: number } | null = null

async function getDevToken(): Promise<string | null> {
  const stored = localStorage.getItem('access_token')
  if (stored) return stored

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  try {
    const params = new URLSearchParams()
    params.append('client_id', 'parking-frontend')
    params.append('grant_type', 'password')
    params.append('username', 'admin.test')
    params.append('password', 'Admin.123!')

    const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180'
    const res = await axios.post(`${keycloakUrl}/realms/parking/protocol/openid-connect/token`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    if (res.data?.access_token) {
      const token = res.data.access_token
      const expiresIn = (res.data.expires_in || 300) * 1000
      cachedToken = { token, expiresAt: Date.now() + expiresIn - 10000 }
      return token
    }
  } catch (err) {
    console.error('Error al obtener dev token de Keycloak:', err)
  }
  return null
}

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.MODE === 'test') {
    return config
  }
  return (async () => {
    if (import.meta.env.DEV && !config.headers.Authorization) {
      const token = await getDevToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
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

    if (!error?.config?.skipToast) {
      useToastStore.getState().addToast({
        message: parsedError.message,
        type: 'error',
      })
    }

    const enrichedError = Object.assign(error ?? new Error(message), parsedError, { parsedError })

    return Promise.reject(enrichedError)
  },
)

export default apiClient


