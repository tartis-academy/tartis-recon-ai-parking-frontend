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
let authFailed = false

async function getDevToken(): Promise<string | null> {
  const stored = localStorage.getItem('access_token')
  if (stored) return stored

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const username = import.meta.env.VITE_DEV_USER
  const password = import.meta.env.VITE_DEV_PASSWORD

  if (!username || !password) {
    console.error('VITE_DEV_USER / VITE_DEV_PASSWORD no configurados: define un .env.local (ver .env.example) para usar el atajo de login de desarrollo.')
    return null
  }

  try {
    const params = new URLSearchParams()
    params.append('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'parking-frontend')
    params.append('grant_type', 'password')
    params.append('username', username)
    params.append('password', password)

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
    if (!config.headers.Authorization) {
      const storedToken = localStorage.getItem('access_token')
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`
      } else if (import.meta.env.DEV && !authFailed) {
        // Atajo solo para desarrollo local: en producción no hay login real todavía (ver SEC-XX).
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
      localStorage.removeItem('access_token')
      authFailed = true
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


