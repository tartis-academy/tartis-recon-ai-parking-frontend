import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from '@/testing/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

describe('App', () => {
  it('renders vehicle table', () => {
    renderWithProviders()
    expect(screen.getByText(/listado de vehículos/i)).toBeInTheDocument()
  })

  it('renders create vehicle button after loading', async () => {
    renderWithProviders()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /crear vehículo/i })).toBeInTheDocument()
    })
  })
})
