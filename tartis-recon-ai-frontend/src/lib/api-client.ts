import axios from 'axios'
import { useToastStore } from '@/shared/stores/useToastStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Error en la petición'

    useToastStore.getState().addToast({
      message,
      type: 'error',
    })

    return Promise.reject(error)
  },
)

export default apiClient

