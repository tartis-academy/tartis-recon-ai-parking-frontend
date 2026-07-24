import { http, HttpResponse } from 'msw'
import type { CreateVehicleInput } from '@/features/admin/types/vehicle'

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

export const adminHandlers = [
  http.get('/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),
  http.post('/v1/vehicles', async ({ request }) => {
    const body = (await request.json()) as CreateVehicleInput
    const newVehicle = {
      uniqueId: String(mockVehicles.length + 1),
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
]
