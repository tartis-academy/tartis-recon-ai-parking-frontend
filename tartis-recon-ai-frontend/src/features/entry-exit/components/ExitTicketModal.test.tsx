import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ExitTicketModal } from './ExitTicketModal'
import type { CheckOutResponse } from '@/types/stay'

const paidTicket: CheckOutResponse = {
  stayId: 'STAY-123',
  licensePlate: 'ABC1234',
  entryTime: '2026-07-28T10:00:00.000Z',
  exitTime: '2026-07-28T11:15:00.000Z',
  totalAmount: 15.5,
  currency: 'EUR',
  paid: true,
}

const pendingTicket: CheckOutResponse = {
  ...paidTicket,
  paid: false,
}

describe('ExitTicketModal', () => {
  it('renders the ticket breakdown with all fields', () => {
    render(<ExitTicketModal ticket={paidTicket} onClose={vi.fn()} />)

    expect(screen.getByText('Ticket de Salida')).toBeInTheDocument()
    expect(screen.getByText('ABC1234')).toBeInTheDocument()
    expect(screen.getByText('STAY-123')).toBeInTheDocument()
    expect(screen.getByText('15.50 EUR')).toBeInTheDocument()
  })

  it('shows a paid badge when the ticket is paid', () => {
    render(<ExitTicketModal ticket={paidTicket} onClose={vi.fn()} />)

    expect(screen.getByText('Pagado')).toBeInTheDocument()
  })

  it('shows a pending badge when the ticket is not paid', () => {
    render(<ExitTicketModal ticket={pendingTicket} onClose={vi.fn()} />)

    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('calls onClose when the close icon button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExitTicketModal ticket={paidTicket} onClose={onClose} />)

    const closeButtons = screen.getAllByRole('button', { name: /cerrar/i })
    await user.click(closeButtons[0])

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the footer close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExitTicketModal ticket={paidTicket} onClose={onClose} />)

    const closeButtons = screen.getAllByRole('button', { name: /cerrar/i })
    await user.click(closeButtons[closeButtons.length - 1])

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
