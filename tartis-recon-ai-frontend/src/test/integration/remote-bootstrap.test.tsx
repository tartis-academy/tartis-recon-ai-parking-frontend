import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { routeTree } from '@/app/router'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderShellWithRemote(initialPath = '/entry-exit') {
  const memoryHistory = createMemoryHistory({ initialEntries: [initialPath] })
  const testRouter = createRouter({ routeTree, history: memoryHistory })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>,
  )
}

describe('MFEE-09: Test de Integración — Carga de Remote vía Module Federation desde Shell Host', () => {
  it('debe arrancar e inicializar la aplicación remota mfe_entryexit al navegar a /entry-exit', async () => {
    renderShellWithRemote('/entry-exit')

    await waitFor(() => {
      // Verifica que el contenedor del remoto se monte dentro del RemoteSlot del Shell
      expect(screen.getByTestId('entry-exit-app')).toBeInTheDocument()
    })
  })

  it('debe mantener el contenedor raíz y la barra de navegación del Shell mientras renderiza el remote', async () => {
    renderShellWithRemote('/entry-exit')

    await waitFor(() => {
      expect(screen.getByText('TARTIS Recon-AI')).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument()
      expect(screen.getByTestId('entry-exit-app')).toBeInTheDocument()
    })
  })

  it('no debe romper la aplicación ni mostrar pantalla de error durante el bootstrap del módulo remoto', async () => {
    renderShellWithRemote('/entry-exit')

    // Esperar a que el módulo remoto complete el bootstrap/renderizado
    await waitFor(() => {
      expect(screen.getByTestId('entry-exit-app')).toBeInTheDocument()
    })

    // Garantizar que la carga finalizó limpiamente sin mostrar la pantalla de fallo/error
    expect(screen.queryByText(/Módulo no disponible/i)).not.toBeInTheDocument()
  })
})
