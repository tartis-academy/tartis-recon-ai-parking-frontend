import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ActiveTariffCard } from './ActiveTariffCard'
import { useActiveTariff } from '../hooks/useActiveTariff'
import { useTariffs } from '../hooks/useTariffs'
import type { Tariff } from '../types/tariff'

vi.mock('../hooks/useActiveTariff')
vi.mock('../hooks/useTariffs')

type UseActiveTariffResult = ReturnType<typeof useActiveTariff>
type UseTariffsResult = ReturnType<typeof useTariffs>

const mockActiveTariff: Tariff = {
  id: '1',
  name: 'Tarifa Coche Estándar',
  type: 'CAR',
  basePrice: 1.50,
  pricePerMinute: 0.05,
  active: true,
}

describe('ActiveTariffCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useTariffs).mockReturnValue({
      data: [mockActiveTariff],
      isLoading: false,
      isError: false,
    } as unknown as UseTariffsResult)
  })

  it('renders active tariff card with data correctly', () => {
    vi.mocked(useActiveTariff).mockReturnValue({
      data: mockActiveTariff,
      isLoading: false,
      isError: false,
    } as unknown as UseActiveTariffResult)

    render(<ActiveTariffCard />)

    expect(screen.getByText('Tarifa Activa por Tipo de Vehículo')).toBeInTheDocument()
    expect(screen.getByText('Tarifa Coche Estándar')).toBeInTheDocument()
    expect(screen.getByText('Tarifa Vigente')).toBeInTheDocument()
    expect(screen.getByText('1.50 €')).toBeInTheDocument()
    expect(screen.getByText('0.05 €/min')).toBeInTheDocument()
  })

  it('renders loading state when query is loading', () => {
    vi.mocked(useActiveTariff).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as UseActiveTariffResult)

    render(<ActiveTariffCard />)

    expect(screen.getByText('Consultando tarifa activa...')).toBeInTheDocument()
  })

  it('renders not found message when active tariff is null', () => {
    vi.mocked(useActiveTariff).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as unknown as UseActiveTariffResult)

    render(<ActiveTariffCard />)

    expect(screen.getByText('No hay una tarifa activa configurada para este tipo de vehículo.')).toBeInTheDocument()
  })

  it('renders error state when query encounters error', () => {
    vi.mocked(useActiveTariff).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as UseActiveTariffResult)

    render(<ActiveTariffCard />)

    expect(screen.getByText('Error al consultar la tarifa activa.')).toBeInTheDocument()
  })

  it('allows changing vehicle type option', async () => {
    const user = userEvent.setup()
    vi.mocked(useActiveTariff).mockReturnValue({
      data: mockActiveTariff,
      isLoading: false,
      isError: false,
    } as unknown as UseActiveTariffResult)

    render(<ActiveTariffCard />)

    const select = screen.getByRole('combobox', { name: /seleccionar tipo/i })
    await user.selectOptions(select, 'MOTORBIKE')

    expect(useActiveTariff).toHaveBeenCalledWith('MOTORBIKE')
  })

  it('dynamically includes custom vehicle types from tariffs list', () => {
    vi.mocked(useTariffs).mockReturnValue({
      data: [
        { id: '1', name: 'Truck', type: 'TRUCK', basePrice: 5, pricePerMinute: 0.1, active: true },
      ],
    } as unknown as UseTariffsResult)
    vi.mocked(useActiveTariff).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as unknown as UseActiveTariffResult)

    render(<ActiveTariffCard />)

    expect(screen.getByRole('option', { name: 'TRUCK' })).toBeInTheDocument()
  })
})
