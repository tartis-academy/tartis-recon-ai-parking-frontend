import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeAll, afterEach, afterAll, describe, it, expect } from 'vitest'
import { StayListContainer } from '../containers/StayListContainer'
import { server } from '@/testing/mocks/server'

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <StayListContainer />
    </QueryClientProvider>,
  )
}

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe('StayListContainer integration', () => {
  it('renders paginated stay list from MSW', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    expect(screen.getByText('1 - 10 de 11 registros')).toBeInTheDocument()
  })

  it('navigates to next page', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'UVWX222' })).toBeInTheDocument()
    })

    expect(screen.getByText('11 - 11 de 11 registros')).toBeInTheDocument()
  })

  it('filters stays by plate search', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/buscar por matrícula/i)
    await user.type(searchInput, 'ABC')

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    expect(screen.queryByRole('cell', { name: '5678DEF' })).not.toBeInTheDocument()
    expect(screen.getByText('1 - 2 de 2 registros')).toBeInTheDocument()
  })

  it('filters stays by status', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    const statusSelect = screen.getByLabelText(/filtrar por estado/i)
    await user.selectOptions(statusSelect, 'FINISHED')

    await waitFor(() => {
      expect(screen.queryByRole('cell', { name: '1234ABC' })).not.toBeInTheDocument()
    })

    expect(screen.getByRole('cell', { name: '5678DEF' })).toBeInTheDocument()
  })

  it('filters stays by vehicle type', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    const typeSelect = screen.getByLabelText(/filtrar por tipo de vehículo/i)
    await user.selectOptions(typeSelect, 'MOTORBIKE')

    await waitFor(() => {
      expect(screen.queryByRole('cell', { name: '1234ABC' })).not.toBeInTheDocument()
    })

    expect(screen.getByRole('cell', { name: '7890MNO' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'EFGH456' })).toBeInTheDocument()
  })

  it('disables next button on last page', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    })

    const pageSizeSelect = screen.getByLabelText(/registros por página/i)
    await user.selectOptions(pageSizeSelect, '50')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled()
    })
  })
})
