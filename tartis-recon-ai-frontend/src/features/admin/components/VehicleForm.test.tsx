import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VehicleForm } from './VehicleForm'
import { describe, it, expect, vi } from 'vitest'

function renderForm() {
  const onSubmit = vi.fn()
  const onClose = vi.fn()
  
  render(
    <VehicleForm 
      onSubmit={onSubmit}
      onClose={onClose}
      isPending={false}
    />,
  )
  
  return { onSubmit, onClose }
}

describe('VehicleForm', () => {
  it('renders form fields', () => {
    renderForm()
    
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/marca/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/modelo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/puertas/i)).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    renderForm()
    
    const submitButton = screen.getByRole('button', { name: /registrar vehículo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/plate is required/i)).toBeInTheDocument()
      expect(screen.getByText(/brand is required/i)).toBeInTheDocument()
      expect(screen.getByText(/model is required/i)).toBeInTheDocument()
    })
  })

  it('shows numDoors field when type is CAR', async () => {
    const user = userEvent.setup()
    renderForm()
    
    const typeSelect = screen.getByLabelText(/tipo/i)
    await user.selectOptions(typeSelect, 'CAR')
    
    expect(screen.getByLabelText(/puertas/i)).toBeInTheDocument()
  })

  it('shows hasSidecar field when type is MOTORBIKE', async () => {
    const user = userEvent.setup()
    renderForm()
    
    const typeSelect = screen.getByLabelText(/tipo/i)
    await user.selectOptions(typeSelect, 'MOTORBIKE')
    
    expect(screen.getByLabelText(/tiene sidecar/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()
    
    await user.type(screen.getByLabelText(/matrícula/i), '1234ABC')
    await user.selectOptions(screen.getByLabelText(/tipo/i), 'CAR')
    await user.type(screen.getByLabelText(/marca/i), 'Toyota')
    await user.type(screen.getByLabelText(/modelo/i), 'Corolla')
    await user.type(screen.getByLabelText(/color/i), 'White')
    await user.clear(screen.getByLabelText(/puertas/i))
    await user.type(screen.getByLabelText(/puertas/i), '4')
    
    const submitButton = screen.getByRole('button', { name: /registrar vehículo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
