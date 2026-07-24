import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TicketTable } from './TicketTable'
import type { Ticket } from '../types/ticket'

const mockTickets: Ticket[] = [
  {
    uniqueId: 'tk-1001',
    stayId: 'stay-001',
    issuedAt: '2026-07-21T14:30:00.000Z',
    totalAmount: 12.5,
  },
  {
    uniqueId: 'tk-1002',
    stayId: 'stay-002',
    issuedAt: '2026-07-19T13:45:00.000Z',
    totalAmount: 4.05,
  },
]

describe('TicketTable', () => {
  const defaultProps = {
    tickets: mockTickets,
    total: 2,
    page: 1,
    pageSize: 10,
    search: '',
    dateFrom: '',
    dateTo: '',
    onSearchChange: vi.fn(),
    onDateFromChange: vi.fn(),
    onDateToChange: vi.fn(),
    onSortChange: vi.fn(),
    onPaginationChange: vi.fn(),
    onClearFilters: vi.fn(),
    isLoading: false,
    isError: false,
  }

  it('renders ticket table headers and row items correctly with aria-sort attributes', () => {
    const { container } = render(<TicketTable {...defaultProps} sortBy="totalAmount" sortOrder="desc" />)

    expect(screen.getByText('ID Ticket')).toBeInTheDocument()
    expect(screen.getByText('ID Estancia')).toBeInTheDocument()
    expect(screen.getByText('Fecha Emisión')).toBeInTheDocument()
    expect(screen.getByText('Importe Total')).toBeInTheDocument()

    expect(screen.getByText('tk-1001')).toBeInTheDocument()
    expect(screen.getByText('stay-001')).toBeInTheDocument()

    const headers = container.querySelectorAll('th')
    expect(headers[3]).toHaveAttribute('aria-sort', 'descending')
    expect(headers[0]).toHaveAttribute('aria-sort', 'none')
  })

  it('shows clear filters button when sortBy is active', () => {
    render(<TicketTable {...defaultProps} sortBy="uniqueId" sortOrder="asc" />)

    expect(screen.getByRole('button', { name: /Limpiar filtros/i })).toBeInTheDocument()
  })

  it('calls onSearchChange when typing into search input', async () => {
    const onSearchChange = vi.fn()
    const user = userEvent.setup()

    render(<TicketTable {...defaultProps} onSearchChange={onSearchChange} />)

    const searchInput = screen.getByPlaceholderText('Buscar por ID de ticket o estancia...')
    await user.type(searchInput, 'tk-1001')

    expect(onSearchChange).toHaveBeenCalled()
  })

  it('calls onSortChange when clicking a table header', async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()

    render(<TicketTable {...defaultProps} onSortChange={onSortChange} />)

    const amountHeaderBtn = screen.getByRole('button', { name: /Importe Total/i })
    await user.click(amountHeaderBtn)

    expect(onSortChange).toHaveBeenCalledWith('totalAmount')
  })

  it('calls onDateFromChange and onDateToChange when date inputs change', async () => {
    const onDateFromChange = vi.fn()
    const onDateToChange = vi.fn()
    const user = userEvent.setup()

    const { container } = render(
      <TicketTable
        {...defaultProps}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
      />,
    )

    const dateInputs = container.querySelectorAll('input[type="date"]')
    expect(dateInputs).toHaveLength(2)

    await user.type(dateInputs[0], '2026-07-20')
    expect(onDateFromChange).toHaveBeenCalled()

    await user.type(dateInputs[1], '2026-07-21')
    expect(onDateToChange).toHaveBeenCalled()
  })

  it('renders empty state when ticket list is empty', () => {
    render(<TicketTable {...defaultProps} tickets={[]} total={0} />)

    expect(screen.getByText('No hay tickets registrados en el sistema.')).toBeInTheDocument()
  })

  it('renders error message inside CardBody when isError is true without unmounting header', () => {
    render(<TicketTable {...defaultProps} isError={true} />)

    expect(screen.getByText('Tickets')).toBeInTheDocument()
    expect(screen.getByText('Error al cargar los tickets.')).toBeInTheDocument()
  })
})
