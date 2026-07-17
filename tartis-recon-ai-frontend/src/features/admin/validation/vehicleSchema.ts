import { z } from 'zod'

const baseSchema = z.object({
  plate: z.string().min(1, 'Plate is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  color: z.string().min(1, 'Color is required'),
})

const carSchema = baseSchema.extend({
  type: z.enum(['CAR', 'CAR_PMR']),
  numDoors: z.number().min(2, 'Minimum 2 doors').max(5, 'Maximum 5 doors'),
  hasSideCar: z.literal(false),
})

const motorbikeSchema = baseSchema.extend({
  type: z.literal('MOTORBIKE'),
  numDoors: z.literal(0),
  hasSideCar: z.boolean(),
})

export const vehicleSchema = z.discriminatedUnion('type', [
  carSchema,
  motorbikeSchema,
])

export type VehicleFormData = z.infer<typeof vehicleSchema>
