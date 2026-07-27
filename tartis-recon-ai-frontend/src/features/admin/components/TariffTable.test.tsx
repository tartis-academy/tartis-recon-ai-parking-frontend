import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TariffTable } from './TariffTable'
import type { Tariff } from '../types/tariff'

const sampleTariffs: Tariff[] = [
  {
    id: '1',
    name: 'Tarifa Coche Estándar',
    type: 'CAR',
    basePrice: 1.50,
    pricePerMinute: 0.05,
    active: true,
  },
  {
    id: '2',
    name: 'Tarifa Moto Económica',
    type: 'MOTORBIKE',
    basePrice: 0.80,
    pricePerMinute: 0.03,
    active: false,
  },
]

describe('TariffTable', () => {
  it('renders tariff table headers and row details correctly', () => {
    render(
      <TariffTable
        tariffs={sampleTariffs}
        onToggleStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Tarifa Coche Estándar')).toBeInTheDocument()
    expect(screen.getByText('Tarifa Moto Económica')).toBeInTheDocument()

    // Base price and price per minute formatting
    expect(screen.getByText('1.50 €')).toBeInTheDocument()
    expect(screen.getByText('0.05 €/min')).toBeInTheDocument()
    expect(screen.getByText('0.80 €')).toBeInTheDocument()
    expect(screen.getByText('0.03 €/min')).toBeInTheDocument()

    // Status badges
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Inactiva')).toBeInTheDocument()
  })

  it('calls onToggleStatus when status toggle button is clicked', async () => {
    const user = userEvent.setup()
    const onToggleStatusMock = vi.fn()

    render(
      <TariffTable
        tariffs={sampleTariffs}
        onToggleStatus={onToggleStatusMock}
        onDelete={vi.fn()}
      />,
    )

    const toggleButtons = screen.getAllByRole('button', { name: /desactivar|activar/i })
    await user.click(toggleButtons[0])

    expect(onToggleStatusMock).toHaveBeenCalledWith('1', false)
  })

  it('opens confirmation modal and calls onDelete when delete is confirmed', async () => {
    const user = userEvent.setup()
    const onDeleteMock = vi.fn()

    render(
      <TariffTable
        tariffs={sampleTariffs}
        onToggleStatus={vi.fn()}
        onDelete={onDeleteMock}
      />,
    )

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    await user.click(deleteButtons[0])

    // Confirmation modal should be open
    expect(screen.getByText('¿Eliminar tarifa?')).toBeInTheDocument()

    // Click confirm inside modal
    const modalButtons = screen.getAllByRole('button', { name: /eliminar/i })
    // The second delete button is inside the modal
    await user.click(modalButtons[modalButtons.length - 1])

    expect(onDeleteMock).toHaveBeenCalledWith('1')
  })
})
