import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { StayTable } from './StayTable'
import type { Stay } from '../types/stay'

const mockStays: Stay[] = [
  {
    id: '1',
    vehicleId: 'v1',
    spotId: 's1',
    tariffId: 't1',
    checkIn: '2026-07-22T08:30:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicle: { plate: '1234ABC' },
    spot: { code: 'A-01' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
  },
  {
    id: '2',
    vehicleId: 'v2',
    spotId: 's2',
    tariffId: 't2',
    checkIn: '2026-07-21T10:00:00.000Z',
    checkOut: '2026-07-21T14:30:00.000Z',
    totalAmount: 12.5,
    status: 'FINISHED',
    vehicle: { plate: '5678DEF' },
    spot: { code: 'B-02' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
  },
  {
    id: '3',
    vehicleId: 'v3',
    spotId: 's3',
    tariffId: 't1',
    checkIn: '2026-07-20T09:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'CANCELLED',
    vehicle: { plate: '9012GHI' },
    spot: { code: 'C-03' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
  },
]

function renderStayTable(props = {}) {
  const defaultProps = {
    stays: mockStays,
    total: mockStays.length,
    page: 1,
    pageSize: 10,
    search: '',
    status: 'ALL' as const,
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onPaginationChange: vi.fn(),
    isLoading: false,
    isError: false,
  }

  return render(<StayTable {...defaultProps} {...props} />)
}

describe('StayTable', () => {
  it('renders column headers', () => {
    renderStayTable()

    expect(screen.getByRole('columnheader', { name: /matrícula/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /plaza/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /tarifa/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /entrada/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /salida/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /total/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /estado/i })).toBeInTheDocument()
  })

  it('renders stay rows with populated data', () => {
    renderStayTable()

    expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'A-01' })).toBeInTheDocument()
    expect(screen.getAllByRole('cell', { name: 'Tarifa Coche' })).toHaveLength(2)
    expect(screen.getByRole('cell', { name: '5678DEF' })).toBeInTheDocument()
  })

  it('shows placeholder for null check-out and total on in-progress stays', () => {
    renderStayTable()

    const rows = screen.getAllByRole('row')
    const inProgressRow = rows.find((row) => row.textContent?.includes('1234ABC'))
    expect(inProgressRow).toBeDefined()
    expect(inProgressRow!.textContent).toContain('—')
  })

  it('renders status badges for each stay status', () => {
    renderStayTable()

    const rows = screen.getAllByRole('row')
    const inProgressRow = rows.find((row) => row.textContent?.includes('1234ABC'))
    const finishedRow = rows.find((row) => row.textContent?.includes('5678DEF'))
    const cancelledRow = rows.find((row) => row.textContent?.includes('9012GHI'))

    expect(inProgressRow?.textContent).toContain('En curso')
    expect(finishedRow?.textContent).toContain('Finalizada')
    expect(cancelledRow?.textContent).toContain('Cancelada')
  })

  it('calls onSearchChange when search input changes', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    renderStayTable({ onSearchChange })

    const searchInput = screen.getByPlaceholderText(/buscar por matrícula/i)
    await user.type(searchInput, 'ABC')

    expect(onSearchChange).toHaveBeenCalledTimes(3)
    expect(onSearchChange.mock.calls[0][0]).toBe('A')
    expect(onSearchChange.mock.calls[1][0]).toBe('B')
    expect(onSearchChange.mock.calls[2][0]).toBe('C')
  })

  it('calls onStatusChange when status filter changes', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    renderStayTable({ onStatusChange })

    const statusSelect = screen.getByLabelText(/filtrar por estado/i)
    await user.selectOptions(statusSelect, 'IN_PROGRESS')

    expect(onStatusChange).toHaveBeenCalledWith('IN_PROGRESS')
  })

  it('renders empty state when no stays are provided', () => {
    renderStayTable({ stays: [], total: 0 })

    expect(screen.getByText(/no hay estancias registradas/i)).toBeInTheDocument()
  })

  it('renders loading state', () => {
    renderStayTable({ isLoading: true })

    expect(screen.getByText(/cargando estancias/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    renderStayTable({ isError: true })

    expect(screen.getByText(/error al cargar las estancias/i)).toBeInTheDocument()
  })
})
