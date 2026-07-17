import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// TODO: Configurar interceptor de token si se requiere en el futuro
