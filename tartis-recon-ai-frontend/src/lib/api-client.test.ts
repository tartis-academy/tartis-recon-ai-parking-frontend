import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/testing/mocks/server'
import { apiClient, type ParsedApiError, type BackendErrorPayload } from './api-client'
import { useToastStore } from '@/shared/stores/useToastStore'

describe('apiClient Response Interceptor', () => {
  beforeAll(() => {
    apiClient.defaults.baseURL = 'http://localhost'
    server.listen({ onUnhandledRequest: 'bypass' })
  })

  beforeEach(() => {
    useToastStore.getState().clearToasts()
  })

  afterEach(() => {
    server.resetHandlers()
    vi.restoreAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  it('debe retornar la respuesta intacta cuando el status es 200 (éxito)', async () => {
    server.use(
      http.get('http://localhost/test-success', () => {
        return HttpResponse.json({ data: 'ok' }, { status: 200 })
      }),
    )

    const response = await apiClient.get('/test-success')
    expect(response.status).toBe(200)
    expect(response.data).toEqual({ data: 'ok' })
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('debe capturar y formatear un error 400 Bad Request', async () => {
    const errorPayload: BackendErrorPayload = {
      timestamp: '2026-07-29T10:00:00Z',
      status: 400,
      error: 'Bad Request',
      message: 'Parámetros de consulta no válidos',
      path: '/test-400',
    }

    server.use(
      http.get('http://localhost/test-400', () => {
        return HttpResponse.json(errorPayload, { status: 400 })
      }),
    )

    try {
      await apiClient.get('/test-400')
      expect.fail('La promesa debería haber sido rechazada')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError).toEqual({
        timestamp: '2026-07-29T10:00:00Z',
        status: 400,
        error: 'Bad Request',
        message: 'Parámetros de consulta no válidos',
        path: '/test-400',
      })
    }

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('Parámetros de consulta no válidos')
    expect(toasts[0].type).toBe('error')
  })

  it('debe capturar y formatear un error 404 Not Found', async () => {
    const errorPayload: BackendErrorPayload = {
      timestamp: '2026-07-29T10:05:00Z',
      status: 404,
      error: 'Not Found',
      message: 'Recurso no encontrado',
      path: '/test-404',
    }

    server.use(
      http.get('http://localhost/test-404', () => {
        return HttpResponse.json(errorPayload, { status: 404 })
      }),
    )

    try {
      await apiClient.get('/test-404')
      expect.fail('La promesa debería haber sido rechazada')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError).toEqual({
        timestamp: '2026-07-29T10:05:00Z',
        status: 404,
        error: 'Not Found',
        message: 'Recurso no encontrado',
        path: '/test-404',
      })
    }

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('Recurso no encontrado')
  })

  it('debe capturar y formatear un error 409 Conflict', async () => {
    const errorPayload: BackendErrorPayload = {
      timestamp: '2026-07-29T10:10:00Z',
      status: 409,
      error: 'Conflict',
      message: 'La matrícula ya se encuentra registrada',
      path: '/test-409',
    }

    server.use(
      http.post('http://localhost/test-409', () => {
        return HttpResponse.json(errorPayload, { status: 409 })
      }),
    )

    try {
      await apiClient.post('/test-409', {})
      expect.fail('La promesa debería haber sido rechazada')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError).toEqual({
        timestamp: '2026-07-29T10:10:00Z',
        status: 409,
        error: 'Conflict',
        message: 'La matrícula ya se encuentra registrada',
        path: '/test-409',
      })
    }

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('La matrícula ya se encuentra registrada')
  })

  it('debe capturar y formatear un error 422 Unprocessable Entity', async () => {
    const errorPayload: BackendErrorPayload = {
      timestamp: '2026-07-29T10:15:00Z',
      status: 422,
      error: 'Unprocessable Entity',
      message: 'El campo vehículo es requerido',
      path: '/test-422',
    }

    server.use(
      http.post('http://localhost/test-422', () => {
        return HttpResponse.json(errorPayload, { status: 422 })
      }),
    )

    try {
      await apiClient.post('/test-422', {})
      expect.fail('La promesa debería haber sido rechazada')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError).toEqual({
        timestamp: '2026-07-29T10:15:00Z',
        status: 422,
        error: 'Unprocessable Entity',
        message: 'El campo vehículo es requerido',
        path: '/test-422',
      })
    }

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('El campo vehículo es requerido')
  })

  it('debe usar "error" de la respuesta como mensaje si "message" no está presente', async () => {
    server.use(
      http.get('http://localhost/test-no-message', () => {
        return HttpResponse.json(
          { error: 'Error Interno Personalizado', status: 500 },
          { status: 500 },
        )
      }),
    )

    try {
      await apiClient.get('/test-no-message')
      expect.fail('Debe rechazar')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError.message).toBe('Error Interno Personalizado')
      expect(parsedError.error).toBe('Error Interno Personalizado')
      expect(parsedError.status).toBe(500)
    }
  })

  it('debe usar error.message o mensaje genérico por defecto cuando responseData está vacío o no contiene mensaje/error', async () => {
    server.use(
      http.get('http://localhost/test-empty-body', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
      }),
    )

    try {
      await apiClient.get('/test-empty-body')
      expect.fail('Debe rechazar')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError.status).toBe(500)
      expect(parsedError.error).toBe('AxiosError')
      expect(typeof parsedError.message).toBe('string')
    }
  })

  it('debe manejar errores de red (sin objeto response)', async () => {
    server.use(
      http.get('http://localhost/test-network-error', () => {
        return HttpResponse.error()
      }),
    )

    try {
      await apiClient.get('/test-network-error')
      expect.fail('Debe rechazar por error de red')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError.status).toBe(500)
      expect(parsedError.error).toBe('AxiosError')
      expect(parsedError.message).toBe('Network Error')
    }
  })

  it('debe usar el mensaje por defecto "Error en la petición" si no existe mensaje ni en responseData ni en error', async () => {
    const interceptors = (apiClient.interceptors.response as unknown as {
      handlers: Array<{ rejected: (error: unknown) => Promise<never> }>
    }).handlers

    const errorHandler = interceptors[0].rejected

    try {
      await errorHandler({})
      expect.fail('Debe rechazar')
    } catch (err) {
      const parsedError = err as ParsedApiError
      expect(parsedError.status).toBe(500)
      expect(parsedError.error).toBe('Error')
      expect(parsedError.message).toBe('Error en la petición')
    }
  })
})
