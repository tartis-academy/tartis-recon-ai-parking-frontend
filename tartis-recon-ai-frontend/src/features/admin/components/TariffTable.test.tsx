import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TariffTable } from './TariffTable'
import { describe, it, expect, vi } from 'vitest'
import type { Tariff } from '../types/tariff'

const mockTariffsList: Tariff[] = [
  {
    id: '1',
    name: 'Tarifa Coche Estándar',
    vehicleType: 'CAR',
    pricePerMinute: 0.05,
    basePrice: 1.00,
    active: true,
  },
  {
    id: '2',
    name: 'Tarifa Moto Económica',
    vehicleType: 'MOTORBIKE',
    pricePerMinute: 0.03,
    basePrice: 0.50,
    active: false,
  },
]

describe('TariffTable', () => {
  it('renders table headers and tariff data correctly', () => {
    render(<TariffTable tariffs={mockTariffsList} />)

    expect(screen.getByText('Tarifa Coche Estándar')).toBeInTheDocument()
    expect(screen.getByText('Tarifa Moto Económica')).toBeInTheDocument()

    // Formatted rates
    expect(screen.getByText('1.00 €')).toBeInTheDocument()
    expect(screen.getByText('0.05 €/min')).toBeInTheDocument()
    expect(screen.getByText('0.50 €')).toBeInTheDocument()
    expect(screen.getByText('0.03 €/min')).toBeInTheDocument()

    // Status badges
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Inactiva')).toBeInTheDocument()
  })

  it('triggers onToggleStatus callback when toggle button is clicked', async () => {
    const user = userEvent.setup()
    const onToggleStatusMock = vi.fn()

    render(<TariffTable tariffs={mockTariffsList} onToggleStatus={onToggleStatusMock} />)

    const deactivateButton = screen.getByRole('button', { name: /desactivar/i })
    await user.click(deactivateButton)

    expect(onToggleStatusMock).toHaveBeenCalledWith('1', false)
  })

  it('triggers onDeleteRequest callback when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDeleteRequestMock = vi.fn()

    render(<TariffTable tariffs={mockTariffsList} onDeleteRequest={onDeleteRequestMock} />)

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    await user.click(deleteButtons[0])

    expect(onDeleteRequestMock).toHaveBeenCalledWith(mockTariffsList[0])
  })

  it('renders empty state when tariffs list is empty', () => {
    render(<TariffTable tariffs={[]} />)

    expect(screen.getByText(/no hay tarifas registradas en el sistema/i)).toBeInTheDocument()
  })
})
