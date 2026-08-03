import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router'

import { routeTree } from './router'

function renderWithRouter(initialPath = '/') {
  const memoryHistory = createMemoryHistory({ initialEntries: [initialPath] })
  const testRouter = createRouter({ routeTree, history: memoryHistory })
  return render(<RouterProvider router={testRouter} />)
}

afterEach(() => {
  cleanup()
})

describe('Shell Router — pantalla inicial', () => {
  it('muestra las opciones Entrada / Salida y Administración', async () => {
    renderWithRouter('/')

    await waitFor(() => {
      expect(screen.getAllByText('Entrada / Salida').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Administración').length).toBeGreaterThan(0)
    })
  })

  it('muestra el título del shell', async () => {
    renderWithRouter('/')

    await waitFor(() => {
      expect(screen.getByText('TARTIS Recon-AI')).toBeInTheDocument()
    })
  })
})

describe('Shell Router — navegación a remotes', () => {
  it('carga EntryExitApp en /entry-exit', async () => {
    renderWithRouter('/entry-exit')

    await waitFor(() => {
      expect(screen.getByTestId('entry-exit-app')).toBeInTheDocument()
    })
  })

  it('carga AdminApp en /admin', async () => {
    renderWithRouter('/admin')

    await waitFor(() => {
      expect(screen.getByTestId('admin-app')).toBeInTheDocument()
    })
  })
})

describe('Shell Router — resiliencia', () => {
  it('el header y la navegación siguen visibles en rutas de remotes', async () => {
    renderWithRouter('/entry-exit')

    await waitFor(() => {
      expect(screen.getByText('TARTIS Recon-AI')).toBeInTheDocument()
      expect(
        screen.getByRole('navigation', { name: /navegación principal/i }),
      ).toBeInTheDocument()
    })
  })

  it('la navegación global contiene enlaces a todas las rutas', async () => {
    renderWithRouter('/')

    await waitFor(() => {
      const nav = screen.getByRole('navigation', { name: /navegación principal/i })
      expect(nav).toBeInTheDocument()
      expect(screen.getByText('Inicio')).toBeInTheDocument()
    })
  })
})
