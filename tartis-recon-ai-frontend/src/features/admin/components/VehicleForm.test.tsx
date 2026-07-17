import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import VehicleForm from './VehicleForm'
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest'
import { server } from '@/testing/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <VehicleForm />
    </QueryClientProvider>
  )
}

describe('VehicleForm', () => {
  it('renders form fields', () => {
    renderWithProviders()
    
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/marca/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/modelo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/número de puertas/i)).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders()
    
    const submitButton = screen.getByRole('button', { name: /crear vehículo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/plate is required/i)).toBeInTheDocument()
      expect(screen.getByText(/brand is required/i)).toBeInTheDocument()
      expect(screen.getByText(/model is required/i)).toBeInTheDocument()
      expect(screen.getByText(/color is required/i)).toBeInTheDocument()
    })
  })

  it('shows numDoors field when type is CAR', async () => {
    const user = userEvent.setup()
    renderWithProviders()
    
    const typeSelect = screen.getByLabelText(/tipo/i)
    await user.selectOptions(typeSelect, 'CAR')
    
    expect(screen.getByLabelText(/número de puertas/i)).toBeInTheDocument()
  })

  it('shows hasSideCar field when type is MOTORBIKE', async () => {
    const user = userEvent.setup()
    renderWithProviders()
    
    const typeSelect = screen.getByLabelText(/tipo/i)
    await user.selectOptions(typeSelect, 'MOTORBIKE')
    
    expect(screen.getByLabelText(/tiene sidecar/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    renderWithProviders()
    
    await user.type(screen.getByLabelText(/matrícula/i), '1234ABC')
    await user.selectOptions(screen.getByLabelText(/tipo/i), 'CAR')
    await user.type(screen.getByLabelText(/marca/i), 'Toyota')
    await user.type(screen.getByLabelText(/modelo/i), 'Corolla')
    await user.type(screen.getByLabelText(/color/i), 'White')
    await user.clear(screen.getByLabelText(/número de puertas/i))
    await user.type(screen.getByLabelText(/número de puertas/i), '4')
    
    const submitButton = screen.getByRole('button', { name: /crear vehículo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/crear vehículo/i)
    })
  })
})
