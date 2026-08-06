import { describe, it, expect, afterEach } from 'vitest'
import { keycloak, getRoles, hasRole } from './keycloak'

describe('getRoles / hasRole', () => {
  afterEach(() => {
    keycloak.tokenParsed = undefined
  })

  it('devuelve los roles de realm del token', () => {
    keycloak.tokenParsed = { realm_access: { roles: ['ADMIN', 'USER'] } }

    expect(getRoles()).toEqual(['ADMIN', 'USER'])
    expect(hasRole('ADMIN')).toBe(true)
    expect(hasRole('OPERARIO')).toBe(false)
  })

  it('devuelve lista vacía antes de que initKeycloak() haya parseado el token', () => {
    expect(getRoles()).toEqual([])
    expect(hasRole('ADMIN')).toBe(false)
  })

  it('devuelve lista vacía si el token no trae realm_access', () => {
    keycloak.tokenParsed = { sub: 'sin-roles' }

    expect(getRoles()).toEqual([])
  })
})
