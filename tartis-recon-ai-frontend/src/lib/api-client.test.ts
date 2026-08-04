import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

vi.mock('./keycloak', () => ({
  keycloak: { login: vi.fn() },
  getAuthToken: vi.fn(),
}))

import apiClient from './api-client'
import { getAuthToken } from './keycloak'

describe('apiClient', () => {
  it('se inicializa correctamente con la configuración por defecto', () => {
    expect(apiClient).toBeDefined()
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })

  describe('interceptor de autenticación', () => {
    const originalAdapter = apiClient.defaults.adapter

    beforeEach(() => {
      vi.stubEnv('MODE', 'development')
    })

    afterEach(() => {
      vi.unstubAllEnvs()
      vi.mocked(getAuthToken).mockReset()
      apiClient.defaults.adapter = originalAdapter
    })

    function stubAdapterAndCapture() {
      let capturedConfig: InternalAxiosRequestConfig | undefined
      apiClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
        capturedConfig = config
        return {
          data: {},
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse
      }
      return () => capturedConfig
    }

    it('agrega Authorization: Bearer <token> cuando getAuthToken devuelve un token', async () => {
      vi.mocked(getAuthToken).mockResolvedValue('fake-jwt-token')
      const getCapturedConfig = stubAdapterAndCapture()

      await apiClient.get('/api/v1/vehicles')

      expect(getAuthToken).toHaveBeenCalled()
      expect(getCapturedConfig()?.headers.Authorization).toBe('Bearer fake-jwt-token')
    })

    it('no agrega Authorization cuando getAuthToken devuelve null', async () => {
      vi.mocked(getAuthToken).mockResolvedValue(null)
      const getCapturedConfig = stubAdapterAndCapture()

      await apiClient.get('/api/v1/vehicles')

      expect(getCapturedConfig()?.headers.Authorization).toBeUndefined()
    })
  })
})
