import { http, HttpResponse } from 'msw'
import type { CreateVehicleInput } from '@/features/admin/types/vehicle'
import type { Tariff, CreateTariffInput } from '@/features/admin/types/tariff'
import type { PaginatedResponse, Stay } from '@/features/admin/types/stay'

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
    vehicle: { plate: '1234ABC' },
    spot: { code: 'A-01' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
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
    vehicle: { plate: '5678DEF' },
    spot: { code: 'B-02' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
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
    vehicle: { plate: '9012GHI' },
    spot: { code: 'C-03' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
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
    vehicle: { plate: '3456JKL' },
    spot: { code: 'A-04' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
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
    vehicle: { plate: '7890MNO' },
    spot: { code: 'B-05' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
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
    vehicle: { plate: 'ABCD123' },
    spot: { code: 'A-06' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
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
    vehicle: { plate: 'EFGH456' },
    spot: { code: 'B-07' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
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
    vehicle: { plate: 'IJKL789' },
    spot: { code: 'C-08' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
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
    vehicle: { plate: 'MNOP000' },
    spot: { code: 'A-09' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
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
    vehicle: { plate: 'QRST111' },
    spot: { code: 'B-10' },
    tariff: { name: 'Tarifa Moto', rate: 0.03 },
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
    vehicle: { plate: 'UVWX222' },
    spot: { code: 'A-11' },
    tariff: { name: 'Tarifa Coche', rate: 0.05 },
  },
]

const mockTariffs: Tariff[] = [
  {
    id: '1',
    name: 'Tarifa Coche Estándar',
    vehicleType: 'CAR',
    pricePerMinute: 0.05,
    description: 'Tarifa habitual para turismos',
    active: true,
  },
  {
    id: '2',
    name: 'Tarifa Moto Económica',
    vehicleType: 'MOTORBIKE',
    pricePerMinute: 0.03,
    description: 'Tarifa reducida para motocicletas',
    active: true,
  },
]

export const adminHandlers = [
  http.get('/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),
  http.post('/v1/vehicles', async ({ request }) => {
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
  http.get('/v1/spots', () => {
    return HttpResponse.json(mockSpots)
  }),
  http.get('/v1/tariffs', () => {
    return HttpResponse.json(mockTariffs)
  }),
  http.get('/v1/stays', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const status = url.searchParams.get('status')

    let filtered = [...mockStays]

    if (search) {
      filtered = filtered.filter((stay) => stay.vehicle.plate.toLowerCase().includes(search))
    }

    if (status) {
      filtered = filtered.filter((stay) => stay.status === status)
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
  http.post('/v1/tariffs', async ({ request }) => {
    const body = (await request.json()) as CreateTariffInput
    const newTariff: Tariff = {
      id: String(mockTariffs.length + 1),
      ...body,
    }
    mockTariffs.push(newTariff)
    return HttpResponse.json(newTariff, { status: 201 })
  }),
]
