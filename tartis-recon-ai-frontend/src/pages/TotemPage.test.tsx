import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TotemPage } from './TotemPage'
import { stayService } from '@/features/entry-exit'
import type { CheckInResponse, CheckOutResponse } from '@/features/entry-exit'

vi.mock('@/features/entry-exit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/entry-exit')>()
  return {
    ...actual,
    stayService: {
      checkIn: vi.fn(),
      checkOut: vi.fn(),
    },
  }
})

describe('TotemPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial check-in tab and form controls', () => {
    render(<TotemPage />)

    expect(
      screen.getByRole('heading', { name: /simulador de entrada \/ salida/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /entrada \(check-in\)/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /salida \(check-out\)/i }),
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/matrícula del vehículo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo de vehículo/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /emitir entryticket/i }),
    ).toBeInTheDocument()
  })

  it('switches between check-in and check-out tabs', async () => {
    const user = userEvent.setup()
    render(<TotemPage />)

    const checkoutTabBtn = screen.getByRole('button', {
      name: /salida \(check-out\)/i,
    })
    await user.click(checkoutTabBtn)

    expect(
      screen.getByLabelText(/id de ticket o matrícula/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /procesar salida/i }),
    ).toBeInTheDocument()

    const checkinTabBtn = screen.getByRole('button', {
      name: /entrada \(check-in\)/i,
    })
    await user.click(checkinTabBtn)

    expect(screen.getByLabelText(/matrícula del vehículo/i)).toBeInTheDocument()
  })

  it('shows error validation if license plate is empty on check-in', async () => {
    const user = userEvent.setup()
    render(<TotemPage />)

    const plateInput = screen.getByLabelText(/matrícula del vehículo/i)
    await user.type(plateInput, '   ')

    const submitBtn = screen.getByRole('button', { name: /emitir entryticket/i })
    await user.click(submitBtn)

    expect(
      screen.getByText(/por favor ingrese una matrícula válida/i),
    ).toBeInTheDocument()
    expect(stayService.checkIn).not.toHaveBeenCalled()
  })

  it('handles successful check-in and renders ticket details', async () => {
    const user = userEvent.setup()
    const mockCheckInResponse: CheckInResponse = {
      stayId: 'STAY-1234',
      plate: '5678DEF',
      checkIn: '2026-07-27T10:00:00.000Z',
      status: 'IN_PROGRESS',
      entryTicket: {
        ticketId: 'TICK-9876',
        barCode: '*5678DEF*',
        issuedAt: '2026-07-27T10:00:00.000Z',
      },
    }

    vi.mocked(stayService.checkIn).mockResolvedValueOnce(mockCheckInResponse)

    render(<TotemPage />)

    const plateInput = screen.getByLabelText(/matrícula del vehículo/i)
    await user.type(plateInput, '5678def')

    const submitBtn = screen.getByRole('button', { name: /emitir entryticket/i })
    await user.click(submitBtn)

    expect(stayService.checkIn).toHaveBeenCalledWith({
      plate: '5678DEF',
      vehicleType: 'CAR',
    })

    expect(screen.getByText(/ticket emitido exitosamente/i)).toBeInTheDocument()
    expect(screen.getByText('TICK-9876')).toBeInTheDocument()
    expect(screen.getByText('STAY-1234')).toBeInTheDocument()
    expect(screen.getByText('5678DEF')).toBeInTheDocument()
  })

  it('renders real API error message on check-in failure without issuing fake ticket', async () => {
    const user = userEvent.setup()
    const apiError = {
      response: {
        data: {
          message: 'No hay plazas disponibles para este tipo de vehículo (RN-01)',
        },
      },
    }

    vi.mocked(stayService.checkIn).mockRejectedValueOnce(apiError)

    render(<TotemPage />)

    const plateInput = screen.getByLabelText(/matrícula del vehículo/i)
    await user.type(plateInput, '1234ABC')

    const submitBtn = screen.getByRole('button', { name: /emitir entryticket/i })
    await user.click(submitBtn)

    expect(
      screen.getByText(
        /no hay plazas disponibles para este tipo de vehículo \(rn-01\)/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/ticket emitido exitosamente/i),
    ).not.toBeInTheDocument()
  })

  it('handles successful check-out and displays total amount summary', async () => {
    const user = userEvent.setup()
    const mockCheckOutResponse: CheckOutResponse = {
      stayId: 'STAY-4321',
      plate: '9999ZZZ',
      checkIn: '2026-07-27T12:00:00.000Z',
      checkOut: '2026-07-27T14:00:00.000Z',
      amount: 18.75,
      status: 'FINISHED',
    }

    vi.mocked(stayService.checkOut).mockResolvedValueOnce(mockCheckOutResponse)

    render(<TotemPage />)

    const checkoutTabBtn = screen.getByRole('button', {
      name: /salida \(check-out\)/i,
    })
    await user.click(checkoutTabBtn)

    const ticketInput = screen.getByLabelText(/id de ticket o matrícula/i)
    await user.type(ticketInput, '9999ZZZ')

    const submitBtn = screen.getByRole('button', { name: /procesar salida/i })
    await user.click(submitBtn)

    expect(stayService.checkOut).toHaveBeenCalledWith({
      plate: '9999ZZZ',
    })

    expect(screen.getByText(/resumen de salida/i)).toBeInTheDocument()
    expect(screen.getByText('18.75 EUR')).toBeInTheDocument()
    expect(screen.getByText('FINISHED')).toBeInTheDocument()
  })

  it('renders real API error message on check-out failure', async () => {
    const user = userEvent.setup()
    const apiError = {
      response: {
        data: {
          message: 'Ticket no encontrado o ya procesado',
        },
      },
    }

    vi.mocked(stayService.checkOut).mockRejectedValueOnce(apiError)

    render(<TotemPage />)

    const checkoutTabBtn = screen.getByRole('button', {
      name: /salida \(check-out\)/i,
    })
    await user.click(checkoutTabBtn)

    const ticketInput = screen.getByLabelText(/id de ticket o matrícula/i)
    await user.type(ticketInput, 'INVALID')

    const submitBtn = screen.getByRole('button', { name: /procesar salida/i })
    await user.click(submitBtn)

    expect(
      screen.getByText(/ticket no encontrado o ya procesado/i),
    ).toBeInTheDocument()
    expect(screen.queryByText(/resumen de salida/i)).not.toBeInTheDocument()
  })
})
