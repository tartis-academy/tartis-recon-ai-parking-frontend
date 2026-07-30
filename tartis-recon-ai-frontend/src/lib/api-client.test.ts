import { describe, it, expect } from 'vitest'
import apiClient from './api-client'

describe('apiClient', () => {
  it('se inicializa correctamente con la configuración por defecto', () => {
    expect(apiClient).toBeDefined()
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })
})
