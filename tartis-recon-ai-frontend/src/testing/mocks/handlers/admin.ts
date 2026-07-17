import { http, HttpResponse } from 'msw'

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
  },
]

const mockSpots = [
  { id: '1', numSpot: 1, type: 'CAR', status: 'OCCUPIED' },
  { id: '2', numSpot: 2, type: 'CAR', status: 'AVAILABLE' },
  { id: '3', numSpot: 3, type: 'CAR_PMR', status: 'AVAILABLE' },
  { id: '4', numSpot: 4, type: 'MOTORBIKE', status: 'AVAILABLE' },
]

export const adminHandlers = [
  http.get('/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),

  http.get('/v1/spots', () => {
    return HttpResponse.json(mockSpots)
  }),
]
