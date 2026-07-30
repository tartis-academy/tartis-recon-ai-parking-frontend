import { describe, it, expect } from 'vitest'
import { router } from './router'

describe('Shell Host Router', () => {
  it('inicializa la instancia de router del Shell correctamente', () => {
    expect(router).toBeDefined()
    expect(router.options.routeTree).toBeDefined()
  })
})
