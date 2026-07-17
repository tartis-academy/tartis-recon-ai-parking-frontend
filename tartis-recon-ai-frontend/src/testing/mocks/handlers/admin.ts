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

export const adminHandlers = [
  http.get('/v1/vehicles', () => {
    return HttpResponse.json(mockVehicles)
  }),
]
