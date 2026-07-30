import { http, HttpResponse } from 'msw'
import type { CreateVehicleInput } from '@/features/admin/types/vehicle'
import type { Tariff, CreateTariffInput, UpdateTariffInput } from '@/features/admin/types/tariff'
import type { PaginatedResponse, Stay } from '@/features/admin/types/stay'
import type { Ticket } from '@/features/admin/types/ticket'

const sseClients = new Set<ReadableStreamDefaultController>()

function emitEvent(event: string, data: Record<string, unknown> | unknown[] = {}) {
  const encoder = new TextEncoder()
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  const encoded = encoder.encode(message)
  sseClients.forEach((controller) => {
    try {
      controller.enqueue(encoded)
    } catch {
      sseClients.delete(controller)
    }
  })
}

const mockVehicles = [
  {
    uniqueId: '1',
    plate: '1234ABC',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Blanco',
    numDoors: 5,
    hasSidecar: false,
    active: true,
    isParked: true,
  },
  {
    uniqueId: '2',
    plate: '5678DEF',
    type: 'CAR_PMR',
    brand: 'Seat',
    model: 'Ibiza',
    color: 'Rojo',
    numDoors: 3,
    hasSidecar: false,
    active: true,
    isParked: false,
  },
  {
    uniqueId: '3',
    plate: '9012GHI',
    type: 'MOTORBIKE',
    brand: 'Honda',
    model: 'CBR 600',
    color: 'Negro',
    numDoors: 0,
    hasSidecar: false,
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
    stayId: '1',
    plate: '1234ABC',
    vehicleId: '1',
    spotId: 'A-01',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-22T08:30:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicleType: 'CAR',
  },
  {
    stayId: '2',
    plate: '5678DEF',
    vehicleId: '2',
    spotId: 'B-02',
    tariffId: 'trf-m7b9c111-3333-4444-5555-666677778888',
    checkIn: '2026-07-21T10:00:00.000Z',
    checkOut: '2026-07-21T14:30:00.000Z',
    totalAmount: 12.5,
    status: 'FINISHED',
    vehicleType: 'CAR_PMR',
  },
  {
    stayId: '3',
    plate: '9012GHI',
    vehicleId: '3',
    spotId: 'C-03',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-20T09:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'CANCELLED',
    vehicleType: 'MOTORBIKE',
  },
  {
    stayId: '4',
    plate: '3456JKL',
    vehicleId: 'veh-3456jkl',
    spotId: 'A-04',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-22T09:15:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicleType: 'CAR',
  },
  {
    stayId: '5',
    plate: '7890MNO',
    vehicleId: 'veh-7890mno',
    spotId: 'B-05',
    tariffId: 'trf-m7b9c111-3333-4444-5555-666677778888',
    checkIn: '2026-07-19T11:30:00.000Z',
    checkOut: '2026-07-19T13:45:00.000Z',
    totalAmount: 4.05,
    status: 'FINISHED',
    vehicleType: 'MOTORBIKE',
  },
  {
    stayId: '6',
    plate: 'ABCD123',
    vehicleId: 'veh-abcd123',
    spotId: 'A-06',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-18T07:00:00.000Z',
    checkOut: '2026-07-18T12:00:00.000Z',
    totalAmount: 15.0,
    status: 'FINISHED',
    vehicleType: 'CAR',
  },
  {
    stayId: '7',
    plate: 'EFGH456',
    vehicleId: 'veh-efgh456',
    spotId: 'B-07',
    tariffId: 'trf-m7b9c111-3333-4444-5555-666677778888',
    checkIn: '2026-07-22T10:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicleType: 'MOTORBIKE',
  },
  {
    stayId: '8',
    plate: 'IJKL789',
    vehicleId: 'veh-ijkl789',
    spotId: 'C-08',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-17T16:00:00.000Z',
    checkOut: '2026-07-17T18:30:00.000Z',
    totalAmount: 7.5,
    status: 'CANCELLED',
    vehicleType: 'CAR_PMR',
  },
  {
    stayId: '9',
    plate: 'MNOP000',
    vehicleId: 'veh-mnop000',
    spotId: 'A-09',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-16T08:00:00.000Z',
    checkOut: '2026-07-16T10:00:00.000Z',
    totalAmount: 6.0,
    status: 'FINISHED',
    vehicleType: 'CAR',
  },
  {
    stayId: '10',
    plate: 'QRST111',
    vehicleId: 'veh-qrst111',
    spotId: 'B-10',
    tariffId: 'trf-m7b9c111-3333-4444-5555-666677778888',
    checkIn: '2026-07-22T11:00:00.000Z',
    checkOut: null,
    totalAmount: null,
    status: 'IN_PROGRESS',
    vehicleType: 'MOTORBIKE',
  },
  {
    stayId: '11',
    plate: 'UVWX222',
    vehicleId: 'veh-uvwx222',
    spotId: 'A-11',
    tariffId: 'trf-e8a3b000-1111-2222-3333-444455556666',
    checkIn: '2026-07-15T09:30:00.000Z',
    checkOut: '2026-07-15T11:30:00.000Z',
    totalAmount: 6.0,
    status: 'FINISHED',
    vehicleType: 'CAR',
  },
]

const mockTariffs: Tariff[] = [
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
  http.get('*/v1/events/stream', () => {
    const stream = new ReadableStream({
      start(controller) {
        sseClients.add(controller)
      },
      cancel(controller) {
        sseClients.delete(controller)
      },
    })
    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }),
  http.get('*/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),
  http.post('*/v1/vehicles', async ({ request }) => {
    const body = (await request.json()) as CreateVehicleInput
    const newVehicle = {
      uniqueId: String(mockVehicles.length + 1),
      ...body,
      active: true,
      isParked: true,
    }
    mockVehicles.push(newVehicle)
    emitEvent('vehicle_updated', newVehicle)
    return HttpResponse.json(newVehicle, { status: 201 })
  }),
  http.patch('*/v1/vehicles/:id/status', ({ params }) => {
    const { id } = params
    const vehicle = mockVehicles.find((v) => v.uniqueId === id)
    if (!vehicle) {
      return new HttpResponse(null, { status: 404 })
    }
    vehicle.active = !vehicle.active
    emitEvent('vehicle_updated', vehicle)
    return HttpResponse.json(vehicle)
  }),
  http.get('*/v1/spots', () => {
    return HttpResponse.json(mockSpots)
  }),
  http.patch('*/v1/spots/:id/status', async ({ params, request }) => {
    const { id } = params
    const spot = mockSpots.find((s) => s.id === id)
    if (!spot) {
      return new HttpResponse(null, { status: 404 })
    }
    const body = (await request.json()) as { status: string }
    spot.status = body.status
    emitEvent('spot_updated', spot)
    return HttpResponse.json(spot)
  }),
  http.get('*/v1/tariffs', () => {
    return HttpResponse.json(mockTariffs)
  }),
  http.get('*/v1/tariffs/active', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const tariff = mockTariffs.find((t) => t.active && (!type || t.type === type))
    if (!tariff) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(tariff)
  }),
  http.get('*/v1/tickets', ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam !== null ? Number(pageParam) : 0
    const pageSize = Number(url.searchParams.get('size') ?? url.searchParams.get('pageSize') ?? '10')
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
    const start = page * pageSize
    const paginated = filtered.slice(start, start + pageSize)

    const response: PaginatedResponse<Ticket> = {
      content: paginated,
      totalElements: total,
      page,
      size: pageSize,
      totalPages: Math.ceil(total / pageSize),
    }

    return HttpResponse.json(response)
  }),
  http.get('*/v1/stays', ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam !== null ? Number(pageParam) : 0
    const pageSize = Number(url.searchParams.get('size') ?? url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const status = url.searchParams.get('status')
    const vehicleType = url.searchParams.get('vehicleType')

    let filtered = [...mockStays]

    if (search) {
      filtered = filtered.filter((stay) => stay.plate.toLowerCase().includes(search))
    }

    if (status) {
      filtered = filtered.filter((stay) => stay.status === status)
    }

    if (vehicleType) {
      filtered = filtered.filter((stay) => stay.vehicleType === vehicleType)
    }

    const total = filtered.length
    const start = page * pageSize
    const paginated = filtered.slice(start, start + pageSize)

    const response: PaginatedResponse<Stay> = {
      content: paginated,
      totalElements: total,
      page,
      size: pageSize,
      totalPages: Math.ceil(total / pageSize),
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
  http.put('*/v1/tariffs/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as UpdateTariffInput
    const index = mockTariffs.findIndex((t) => t.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockTariffs[index] = { ...mockTariffs[index], ...body }
    return HttpResponse.json(mockTariffs[index])
  }),
  http.patch('*/v1/tariffs/:id/status', async ({ params, request }) => {
    const { id } = params
    const tariff = mockTariffs.find((t) => t.id === id)
    if (!tariff) {
      return new HttpResponse(null, { status: 404 })
    }
    try {
      const body = (await request.json()) as { active?: boolean }
      if (typeof body.active === 'boolean') {
        tariff.active = body.active
      } else {
        tariff.active = !tariff.active
      }
    } catch {
      tariff.active = !tariff.active
    }
    return HttpResponse.json(tariff)
  }),
  http.delete('*/v1/tariffs/:id', ({ params }) => {
    const { id } = params
    const index = mockTariffs.findIndex((t) => t.id === id)
    if (index !== -1) {
      mockTariffs.splice(index, 1)
    }
    return new HttpResponse(null, { status: 204 })
  }),
]

