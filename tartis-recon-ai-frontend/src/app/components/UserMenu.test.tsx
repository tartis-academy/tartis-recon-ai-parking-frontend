import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserMenu } from './UserMenu'
import { keycloak } from '@/lib/keycloak'

describe('UserMenu', () => {
  beforeEach(() => {
    keycloak.tokenParsed = {
      preferred_username: 'operario.test',
      realm_access: { roles: ['OPERARIO'] },
    }
  })

  it('muestra el usuario y su rol de realm', () => {
    render(<UserMenu />)

    expect(screen.getByTestId('username').textContent).toBe('operario.test')
    expect(screen.getByTestId('roles').textContent).toBe('OPERARIO')
  })

  it('muestra SIN ROL cuando el token no trae roles', () => {
    keycloak.tokenParsed = { preferred_username: 'user.test' }

    render(<UserMenu />)

    expect(screen.getByTestId('roles').textContent).toBe('SIN ROL')
  })

  it('el botón de icono es accesible por su nombre', () => {
    render(<UserMenu />)

    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeDefined()
  })

  it('cierra la sesión en Keycloak al pulsar el botón', async () => {
    const logoutSpy = vi.spyOn(keycloak, 'logout').mockImplementation(() => Promise.resolve())

    render(<UserMenu />)
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(logoutSpy).toHaveBeenCalledWith({ redirectUri: window.location.origin })
  })

  it('no renderiza nada si no hay sesión', () => {
    keycloak.tokenParsed = undefined

    const { container } = render(<UserMenu />)

    expect(container.firstChild).toBeNull()
  })
})
