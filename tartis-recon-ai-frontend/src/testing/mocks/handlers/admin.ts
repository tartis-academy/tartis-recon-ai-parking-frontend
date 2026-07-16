import { http, HttpResponse } from 'msw'

const mockVehicles = [
  {
    id: '1',
    plate: '1234ABC',
    type: 'COCHE',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Blanco',
    doors: 4,
  },
  {
    id: '2',
    plate: '5678DEF',
    type: 'COCHE',
    brand: 'Seat',
    model: 'Ibiza',
    color: 'Rojo',
    doors: 3,
  },
  {
    id: '3',
    plate: '9012GHI',
    type: 'MOTO',
    brand: 'Honda',
    model: 'CBR 600',
    color: 'Negro',
    sidecar: false,
  },
  {
    id: '4',
    plate: '3456JKL',
    type: 'COCHE',
    brand: 'Ford',
    model: 'Focus',
    color: 'Azul',
    doors: 5,
  },
  {
    id: '5',
    plate: '7890MNO',
    type: 'MOTO',
    brand: 'Yamaha',
    model: 'MT-07',
    color: 'Gris',
    sidecar: false,
  },
]

const mockSpots = [
  { id: '1', code: 'A-01', vehicleType: 'COCHE', status: 'OCCUPIED' },
  { id: '2', code: 'A-02', vehicleType: 'COCHE', status: 'FREE' },
  { id: '3', code: 'A-03', vehicleType: 'COCHE', status: 'FREE' },
  { id: '4', code: 'A-04', vehicleType: 'COCHE', status: 'OCCUPIED' },
  { id: '5', code: 'B-01', vehicleType: 'MOTO', status: 'FREE' },
  { id: '6', code: 'B-02', vehicleType: 'MOTO', status: 'OCCUPIED' },
  { id: '7', code: 'B-03', vehicleType: 'MOTO', status: 'FREE' },
  { id: '8', code: 'A-05', vehicleType: 'COCHE', status: 'FREE' },
]

export const adminHandlers = [
  http.get('/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),

  http.get('/v1/spots', () => {
    return HttpResponse.json(mockSpots)
  }),
]
