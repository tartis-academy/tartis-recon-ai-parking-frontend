import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TariffForm } from './TariffForm'
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest'
import { server } from '@/testing/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithProviders(onClose = vi.fn(), onSubmit = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <TariffForm onClose={onClose} onSubmit={onSubmit} isPending={false} />
    </QueryClientProvider>,
  )
}

describe('TariffForm', () => {
  it('renders tariff form fields correctly', () => {
    renderWithProviders()

    expect(screen.getByLabelText(/nombre de la tarifa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo de vehículo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/precio base/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/precio por minuto/i)).toBeInTheDocument()
  })

  it('shows validation errors for invalid or short inputs', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    const nameInput = screen.getByLabelText(/nombre de la tarifa/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'AB') // < 3 characters

    const submitButton = screen.getByRole('button', { name: /crear tarifa/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument()
    })
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    const onCloseMock = vi.fn()
    const onSubmitMock = vi.fn()

    renderWithProviders(onCloseMock, onSubmitMock)

    await user.type(screen.getByLabelText(/nombre de la tarifa/i), 'Tarifa VIP Coche')
    await user.selectOptions(screen.getByLabelText(/tipo de vehículo/i), 'CAR')
    await user.clear(screen.getByLabelText(/precio base/i))
    await user.type(screen.getByLabelText(/precio base/i), '2.00')
    await user.clear(screen.getByLabelText(/precio por minuto/i))
    await user.type(screen.getByLabelText(/precio por minuto/i), '0.10')

    const submitButton = screen.getByRole('button', { name: /crear tarifa/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Tarifa VIP Coche',
          vehicleType: 'CAR',
          basePrice: 2.00,
          pricePerMinute: 0.10,
        }),
        expect.anything(),
      )
    })
  })
})

