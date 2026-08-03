import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RemoteErrorBoundary } from './RemoteErrorBoundary'
import { RemoteLoadingFallback } from './RemoteLoadingFallback'
import { RemoteUnavailable } from './RemoteUnavailable'

vi.mock('@tanstack/react-router', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention -- React component mock
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

function ThrowingComponent(): never {
  throw new Error('Remote crashed')
}

describe('RemoteLoadingFallback', () => {
  it('muestra el mensaje de carga', () => {
    render(<RemoteLoadingFallback />)
    expect(screen.getByText('Cargando módulo...')).toBeInTheDocument()
  })

  it('tiene role status para accesibilidad', () => {
    render(<RemoteLoadingFallback />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('RemoteUnavailable', () => {
  it('muestra el mensaje de módulo no disponible', () => {
    render(<RemoteUnavailable />)
    expect(screen.getByText('Módulo no disponible')).toBeInTheDocument()
  })

  it('muestra enlace para volver al inicio', () => {
    render(<RemoteUnavailable />)
    const link = screen.getByText('Volver al inicio')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/')
  })
})

describe('RemoteErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('renderiza children cuando no hay error', () => {
    render(
      <RemoteErrorBoundary>
        <div>Remote Content</div>
      </RemoteErrorBoundary>,
    )
    expect(screen.getByText('Remote Content')).toBeInTheDocument()
  })

  it('muestra fallback cuando un hijo lanza error', () => {
    render(
      <RemoteErrorBoundary moduleName="TestModule">
        <ThrowingComponent />
      </RemoteErrorBoundary>,
    )
    expect(screen.getByText('Módulo no disponible')).toBeInTheDocument()
  })

  it('no propaga el error al padre — el shell sigue funcionando', () => {
    render(
      <div data-testid="shell-parent">
        <RemoteErrorBoundary>
          <ThrowingComponent />
        </RemoteErrorBoundary>
      </div>,
    )
    expect(screen.getByTestId('shell-parent')).toBeInTheDocument()
    expect(screen.getByText('Módulo no disponible')).toBeInTheDocument()
  })

  it('muestra enlace de retorno a / en el fallback', () => {
    render(
      <RemoteErrorBoundary>
        <ThrowingComponent />
      </RemoteErrorBoundary>,
    )
    const link = screen.getByText('Volver al inicio')
    expect(link.closest('a')).toHaveAttribute('href', '/')
  })
})
