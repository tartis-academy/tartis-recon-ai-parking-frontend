import { http, HttpResponse } from 'msw'
import type { CreateVehicleInput } from '@/features/admin/types/vehicle'
import type { Tariff, CreateTariffInput } from '@/features/admin/types/tariff'

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

const mockTariffs: Tariff[] = [
  {
    id: '1',
    name: 'Tarifa Coche Estándar',
    vehicleType: 'CAR',
    pricePerMinute: 0.05,
    basePrice: 1.00,
    active: true,
  },
  {
    id: '2',
    name: 'Tarifa Moto Económica',
    vehicleType: 'MOTORBIKE',
    pricePerMinute: 0.03,
    basePrice: 0.50,
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
  http.post('/v1/tariffs', async ({ request }) => {
    const body = (await request.json()) as CreateTariffInput
    const newTariff: Tariff = {
      id: String(mockTariffs.length + 1),
      ...body,
    }
    mockTariffs.push(newTariff)
    return HttpResponse.json(newTariff, { status: 201 })
  }),
  http.patch('/v1/tariffs/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as { active?: boolean }
    const tariff = mockTariffs.find((t) => t.id === id)
    if (tariff && typeof body.active === 'boolean') {
      tariff.active = body.active
    }
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
