import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ExitTicketModal } from './ExitTicketModal'
import type { CheckOutResponse } from '../types/stay'

const paidTicket: CheckOutResponse = {
  stayId: 'STAY-123',
  plate: 'ABC1234',
  checkIn: '2026-07-28T10:00:00.000Z',
  checkOut: '2026-07-28T11:15:00.000Z',
  amount: 15.5,
  status: 'PAID',
}

const pendingTicket: CheckOutResponse = {
  ...paidTicket,
  status: 'PAY_PENDING',
}

describe('ExitTicketModal', () => {
  it('renders the ticket breakdown with all fields', () => {
    render(<ExitTicketModal ticket={paidTicket} onClose={vi.fn()} />)

    expect(screen.getByText('Ticket de Salida')).toBeInTheDocument()
    expect(screen.getByText('ABC1234')).toBeInTheDocument()
    expect(screen.getByText('STAY-123')).toBeInTheDocument()
    expect(screen.getByText('15.50 EUR')).toBeInTheDocument()
  })

  it('exposes dialog semantics for assistive technology', () => {
    render(<ExitTicketModal ticket={paidTicket} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Ticket de Salida')
  })

  it('shows a paid badge when the ticket is paid', () => {
    render(<ExitTicketModal ticket={paidTicket} onClose={vi.fn()} />)

    expect(screen.getByText('Pagado')).toBeInTheDocument()
  })

  it('shows a pending badge when the ticket is not paid', () => {
    render(<ExitTicketModal ticket={pendingTicket} onClose={vi.fn()} />)

    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('falls back gracefully when a date is malformed', () => {
    render(
      <ExitTicketModal
        ticket={{ ...paidTicket, checkOut: 'not-a-date' }}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getAllByText('Fecha no disponible')).toHaveLength(1)
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

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExitTicketModal ticket={paidTicket} onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay is clicked but not when the dialog content is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExitTicketModal ticket={paidTicket} onClose={onClose} />)

    await user.click(screen.getByText('Ticket de Salida'))
    expect(onClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
