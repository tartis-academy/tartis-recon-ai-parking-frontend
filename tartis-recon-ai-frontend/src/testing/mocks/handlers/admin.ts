import { http, HttpResponse } from 'msw'
import type { CreateVehicleInput } from '@/features/admin/types/vehicle'
import type { Tariff, CreateTariffInput } from '@/features/admin/types/tariff'
import type { PaginatedResponse, Stay } from '@/features/admin/types/stay'
import type { Ticket } from '@/features/admin/types/ticket'

const mockVehicles = [
  {
    id: '1',
    plate: '1234ABC',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Blanco',
    numDoors: 5,
    hasSideCar: false,
    active: true,
    isParked: true,
  },
  {
    id: '2',
    plate: '5678DEF',
    type: 'CAR_PMR',
    brand: 'Seat',
    model: 'Ibiza',
    color: 'Rojo',
    numDoors: 3,
    hasSideCar: false,
    active: true,
    isParked: false,
  },
  {
    id: '3',
    plate: '9012GHI',
    type: 'MOTORBIKE',
    brand: 'Honda',
    model: 'CBR 600',
    color: 'Negro',
    numDoors: 0,
    hasSideCar: false,
    active: true,
    isParked: false,
  },
]

const mockSpots = [
  { id: '1', type: 'CAR', status: 'OCCUPIED' },
  { id: '2', type: 'CAR', status: 'AVAILABLE' },
  { id: '3', type: 'CAR_PMR', status: 'AVAILABLE' },
  { id: '4', type: 'MOTORBIKE', status: 'AVAILABLE' },
]

const mockStays: Stay[] = [
  {
    id: '1',
    vehicleId: '1',
    spotId: '1',
    tariffId: '1',
    checkIn: '2026-07-22T08:30:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicle: { plate: '1234ABC', type: 'CAR' },
    spot: { code: 'A-01' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: { id: 'et-1' },
    ticket: null,
  },
  {
    id: '2',
    vehicleId: '2',
    spotId: '2',
    tariffId: '2',
    checkIn: '2026-07-21T10:00:00.000Z',
    checkOut: '2026-07-21T14:30:00.000Z',
    totalAmount: 12.5,
    status: 'FINISHED',
    vehicle: { plate: '5678DEF', type: 'CAR_PMR' },
    spot: { code: 'B-02' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
    entryTicket: { id: 'et-2' },
    ticket: { id: 'tk-2', totalAmount: 12.5 },
  },
  {
    id: '3',
    vehicleId: '3',
    spotId: '3',
    tariffId: '1',
    checkIn: '2026-07-20T09:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'CANCELLED',
    vehicle: { plate: '9012GHI', type: 'MOTORBIKE' },
    spot: { code: 'C-03' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: null,
    ticket: null,
  },
  {
    id: '4',
    vehicleId: '4',
    spotId: '4',
    tariffId: '1',
    checkIn: '2026-07-22T09:15:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicle: { plate: '3456JKL', type: 'CAR' },
    spot: { code: 'A-04' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: { id: 'et-4' },
    ticket: null,
  },
  {
    id: '5',
    vehicleId: '5',
    spotId: '5',
    tariffId: '2',
    checkIn: '2026-07-19T11:30:00.000Z',
    checkOut: '2026-07-19T13:45:00.000Z',
    totalAmount: 4.05,
    status: 'FINISHED',
    vehicle: { plate: '7890MNO', type: 'MOTORBIKE' },
    spot: { code: 'B-05' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
    entryTicket: { id: 'et-5' },
    ticket: { id: 'tk-5', totalAmount: 4.05 },
  },
  {
    id: '6',
    vehicleId: '6',
    spotId: '6',
    tariffId: '1',
    checkIn: '2026-07-18T07:00:00.000Z',
    checkOut: '2026-07-18T12:00:00.000Z',
    totalAmount: 15.0,
    status: 'FINISHED',
    vehicle: { plate: 'ABCD123', type: 'CAR' },
    spot: { code: 'A-06' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: { id: 'et-6' },
    ticket: { id: 'tk-6', totalAmount: 15.0 },
  },
  {
    id: '7',
    vehicleId: '7',
    spotId: '7',
    tariffId: '2',
    checkIn: '2026-07-22T10:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicle: { plate: 'EFGH456', type: 'MOTORBIKE' },
    spot: { code: 'B-07' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
    entryTicket: { id: 'et-7' },
    ticket: null,
  },
  {
    id: '8',
    vehicleId: '8',
    spotId: '8',
    tariffId: '1',
    checkIn: '2026-07-17T16:00:00.000Z',
    checkOut: '2026-07-17T18:30:00.000Z',
    totalAmount: 7.5,
    status: 'CANCELLED',
    vehicle: { plate: 'IJKL789', type: 'CAR_PMR' },
    spot: { code: 'C-08' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: null,
    ticket: null,
  },
  {
    id: '9',
    vehicleId: '9',
    spotId: '9',
    tariffId: '1',
    checkIn: '2026-07-16T08:00:00.000Z',
    checkOut: '2026-07-16T10:00:00.000Z',
    totalAmount: 6.0,
    status: 'FINISHED',
    vehicle: { plate: 'MNOP000', type: 'CAR' },
    spot: { code: 'A-09' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: { id: 'et-9' },
    ticket: { id: 'tk-9', totalAmount: 6.0 },
  },
  {
    id: '10',
    vehicleId: '10',
    spotId: '10',
    tariffId: '2',
    checkIn: '2026-07-22T11:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicle: { plate: 'QRST111', type: 'MOTORBIKE' },
    spot: { code: 'B-10' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
    entryTicket: { id: 'et-10' },
    ticket: null,
  },
  {
    id: '11',
    vehicleId: '11',
    spotId: '11',
    tariffId: '1',
    checkIn: '2026-07-15T09:30:00.000Z',
    checkOut: '2026-07-15T11:30:00.000Z',
    totalAmount: 6.0,
    status: 'FINISHED',
    vehicle: { plate: 'UVWX222', type: 'CAR' },
    spot: { code: 'A-11' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
    entryTicket: { id: 'et-11' },
    ticket: { id: 'tk-11', totalAmount: 6.0 },
  },
]

const mockTariffs: Tariff[] = [
  {
    id: '1',
    name: 'Tarifa Coche Estándar',
    vehicleType: 'CAR',
    basePrice: 1.50,
    pricePerMinute: 0.05,
    active: true,
  },
  {
    id: '2',
    name: 'Tarifa Moto Económica',
    vehicleType: 'MOTORBIKE',
    basePrice: 0.80,
    pricePerMinute: 0.03,
    active: true,
  },
]

const mockTickets: Ticket[] = [
  {
    uniqueId: 'tk-1001',
    stayId: '2',
    issuedAt: '2026-07-21T14:30:00.000Z',
    totalAmount: 12.5,
  },
  {
    uniqueId: 'tk-1002',
    stayId: '5',
    issuedAt: '2026-07-19T13:45:00.000Z',
    totalAmount: 4.05,
  },
  {
    uniqueId: 'tk-1003',
    stayId: '6',
    issuedAt: '2026-07-18T12:00:00.000Z',
    totalAmount: 15.0,
  },
  {
    uniqueId: 'tk-1004',
    stayId: '9',
    issuedAt: '2026-07-16T10:00:00.000Z',
    totalAmount: 6.0,
  },
  {
    uniqueId: 'tk-1005',
    stayId: '11',
    issuedAt: '2026-07-15T11:30:00.000Z',
    totalAmount: 6.0,
  },
]

export const adminHandlers = [
  http.get('*/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),
  http.post('*/v1/vehicles', async ({ request }) => {
    const body = (await request.json()) as CreateVehicleInput
    const newVehicle = {
      id: String(mockVehicles.length + 1),
      ...body,
      active: true,
      isParked: true,
    }
    mockVehicles.push(newVehicle)
    return HttpResponse.json(newVehicle, { status: 201 })
  }),
  http.get('*/v1/spots', () => {
    return HttpResponse.json(mockSpots)
  }),
  http.get('*/v1/tariffs', () => {
    return HttpResponse.json(mockTariffs)
  }),
  http.get('*/v1/tickets', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const dateFrom = url.searchParams.get('dateFrom')
    const dateTo = url.searchParams.get('dateTo')
    const sortBy = url.searchParams.get('sortBy') as 'uniqueId' | 'stayId' | 'issuedAt' | 'totalAmount' | null
    const sortOrder = (url.searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc'

    let filtered = [...mockTickets]

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.uniqueId.toLowerCase().includes(search) ||
          t.stayId.toLowerCase().includes(search),
      )
    }

    if (dateFrom) {
      const [year, month, day] = dateFrom.split('-').map(Number)
      const fromTime = new Date(year, month - 1, day, 0, 0, 0, 0).getTime()
      filtered = filtered.filter((t) => new Date(t.issuedAt).getTime() >= fromTime)
    }

    if (dateTo) {
      const [year, month, day] = dateTo.split('-').map(Number)
      const toTime = new Date(year, month - 1, day, 23, 59, 59, 999).getTime()
      filtered = filtered.filter((t) => new Date(t.issuedAt).getTime() <= toTime)
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === 'issuedAt') {
          const valA = new Date(a.issuedAt).getTime()
          const valB = new Date(b.issuedAt).getTime()
          return sortOrder === 'asc' ? valA - valB : valB - valA
        }

        const valA = a[sortBy]
        const valB = b[sortBy]
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)

    const response: PaginatedResponse<Ticket> = {
      data: paginated,
      total,
      page,
      pageSize,
    }

    return HttpResponse.json(response)
  }),
  http.get('*/v1/stays', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const status = url.searchParams.get('status')
    const vehicleType = url.searchParams.get('vehicleType')

    let filtered = [...mockStays]

    if (search) {
      filtered = filtered.filter((stay) => stay.vehicle.plate.toLowerCase().includes(search))
    }

    if (status) {
      filtered = filtered.filter((stay) => stay.status === status)
    }

    if (vehicleType) {
      filtered = filtered.filter((stay) => stay.vehicle.type === vehicleType)
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)

    const response: PaginatedResponse<Stay> = {
      data: paginated,
      total,
      page,
      pageSize,
    }

    return HttpResponse.json(response)
  }),
  http.post('*/v1/tariffs', async ({ request }) => {
    const body = (await request.json()) as CreateTariffInput
    const newTariff: Tariff = {
      id: String(mockTariffs.length + 1),
      ...body,
    }
    mockTariffs.push(newTariff)
    return HttpResponse.json(newTariff, { status: 201 })
  }),
  http.patch('/v1/tariffs/:id/status', ({ params }) => {
    const { id } = params
    const tariff = mockTariffs.find((t) => t.id === id)
    if (!tariff) {
      return new HttpResponse(null, { status: 404 })
    }
    tariff.active = !tariff.active
    return HttpResponse.json(tariff)
  }),
  http.delete('/v1/tariffs/:id', ({ params }) => {
    const { id } = params
    const index = mockTariffs.findIndex((t) => t.id === id)
    if (index !== -1) {
      mockTariffs.splice(index, 1)
    }
    return new HttpResponse(null, { status: 204 })
  }),
]

