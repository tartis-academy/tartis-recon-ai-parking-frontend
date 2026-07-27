import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { StayTable } from './StayTable'
import type { Stay } from '../types/stay'

const mockStays: Stay[] = [
  {
    stayId: '1',
    plate: '1234ABC',
    vehicleId: 'Coche',
    spotId: 'A-01',
    tariffId: 'Tarifa Coche',
    checkIn: '2026-07-22T08:30:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicleType: 'CAR',
  },
  {
    stayId: '2',
    plate: '5678DEF',
    vehicleId: 'CAR_PMR',
    spotId: 'B-02',
    tariffId: 'Tarifa Moto',
    checkIn: '2026-07-21T10:00:00.000Z',
    checkOut: '2026-07-21T14:30:00.000Z',
    totalAmount: 12.5,
    status: 'FINISHED',
    vehicleType: 'MOTORBIKE',
  },
  {
    stayId: '3',
    plate: '9012GHI',
    vehicleId: 'Coche',
    spotId: 'C-03',
    tariffId: 'Tarifa Coche',
    checkIn: '2026-07-20T09:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'CANCELLED',
    vehicleType: 'CAR_PMR',
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
    vehicleType: 'ALL' as const,
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onVehicleTypeChange: vi.fn(),
    onPaginationChange: vi.fn(),
    onClearFilters: vi.fn(),
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
    expect(screen.getByRole('columnheader', { name: /importe/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /estado/i })).toBeInTheDocument()
  })

  it('renders stay rows with populated data', () => {
    renderStayTable()

    expect(screen.getByRole('cell', { name: '1234ABC' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'A-01' })).toBeInTheDocument()
    expect(screen.getAllByRole('cell', { name: 'Tarifa Coche' })).toHaveLength(2)
    expect(screen.getByRole('cell', { name: '5678DEF' })).toBeInTheDocument()
  })

  it('shows contextual placeholders for null check-out and total on in-progress stays', () => {
    renderStayTable()

    const rows = screen.getAllByRole('row')
    const inProgressRow = rows.find((row) => row.textContent?.includes('1234ABC'))
    expect(inProgressRow).toBeDefined()
    expect(inProgressRow!.textContent).toContain('En curso')
    expect(inProgressRow!.textContent).toContain('Pendiente')
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

  it('calls onVehicleTypeChange when vehicle type filter changes', async () => {
    const user = userEvent.setup()
    const onVehicleTypeChange = vi.fn()
    renderStayTable({ onVehicleTypeChange })

    const typeSelect = screen.getByLabelText(/filtrar por tipo de vehículo/i)
    await user.selectOptions(typeSelect, 'MOTORBIKE')

    expect(onVehicleTypeChange).toHaveBeenCalledWith('MOTORBIKE')
  })

  it('renders empty state when no stays are provided', () => {
    renderStayTable({ stays: [], total: 0 })

    expect(screen.getAllByText(/no hay estancias registradas/i)).toHaveLength(2)
  })

  it('renders no-results state with clear filters button when search filter is active', () => {
    renderStayTable({ stays: [], total: 0, search: 'ABC' })

    expect(screen.getAllByText(/no se encontraron estancias con los filtros aplicados/i)).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /limpiar filtros/i })).toHaveLength(2)
  })

  it('renders no-results state with clear filters button when status filter is active', () => {
    renderStayTable({ stays: [], total: 0, status: 'IN_PROGRESS' })

    expect(screen.getAllByText(/no se encontraron estancias con los filtros aplicados/i)).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /limpiar filtros/i })).toHaveLength(2)
  })

  it('renders no-results state when vehicle type filter is active', () => {
    renderStayTable({ stays: [], total: 0, vehicleType: 'MOTORBIKE' })

    expect(screen.getAllByText(/no se encontraron estancias con los filtros aplicados/i)).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /limpiar filtros/i })).toHaveLength(2)
  })

  it('does not render clear filters button when no filters are active', () => {
    renderStayTable({ stays: [], total: 0, search: '', status: 'ALL', vehicleType: 'ALL' })

    expect(screen.getAllByText(/no hay estancias registradas/i)).toHaveLength(2)
    expect(screen.queryByRole('button', { name: /limpiar filtros/i })).not.toBeInTheDocument()
  })

  it('calls onClearFilters when clear filters button is clicked', async () => {
    const user = userEvent.setup()
    const onClearFilters = vi.fn()
    renderStayTable({ stays: [], total: 0, search: 'ABC', onClearFilters })

    const clearButtons = screen.getAllByRole('button', { name: /limpiar filtros/i })
    await user.click(clearButtons[0])

    expect(onClearFilters).toHaveBeenCalledTimes(1)
  })

  it('renders loading state', () => {
    renderStayTable({ isLoading: true })

    expect(screen.getByText(/cargando estancias/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    renderStayTable({ isError: true })

    expect(screen.getByText(/error al cargar las estancias/i)).toBeInTheDocument()
  })

  it('renders cards with semantic markup and vehicle type context', () => {
    renderStayTable()

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(mockStays.length)

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(mockStays.length)
    expect(headings[0]).toHaveTextContent('1234ABC')

    expect(cards[0].textContent).toContain('Plaza A-01')
    expect(cards[0].textContent).toContain('Coche')
    expect(cards[0].textContent).toContain('En curso')
    expect(cards[0].textContent).toContain('Pendiente')
    expect(cards[1].textContent).toContain('Moto')

    const terms = screen.getAllByRole('term')
    expect(terms.length).toBe(mockStays.length * 4)

    const definitions = screen.getAllByRole('definition')
    expect(definitions.length).toBe(mockStays.length * 4)
  })

  it('does not render ticket button when onViewTicket is not provided', () => {
    renderStayTable()

    expect(screen.queryByRole('button', { name: /ver ticket/i })).not.toBeInTheDocument()
  })

  it('renders ticket slot when onViewTicket is provided', async () => {
    const user = userEvent.setup()
    const onViewTicket = vi.fn()
    renderStayTable({ onViewTicket })

    const ticketButtons = screen.getAllByRole('button', { name: /ver ticket|ticket no disponible/i })
    expect(ticketButtons).toHaveLength(mockStays.length)

    const enabledButton = ticketButtons.find((button) => !button.hasAttribute('disabled'))
    expect(enabledButton).toBeDefined()
    await user.click(enabledButton!)
    expect(onViewTicket).toHaveBeenCalled()
  })

  it('renders card empty state when no stays are provided', () => {
    renderStayTable({ stays: [], total: 0 })

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getAllByText(/no hay estancias registradas/i)).toHaveLength(2)
  })

  it('renders card no-results state with clear filters button when filters are active', () => {
    renderStayTable({ stays: [], total: 0, search: 'ABC' })

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getAllByText(/no se encontraron estancias con los filtros aplicados/i)).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /limpiar filtros/i })).toHaveLength(2)
  })
})
