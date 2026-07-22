import { z } from 'zod'

export const tariffSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  vehicleType: z.enum(['CAR', 'CAR_PMR', 'MOTORBIKE']),
  pricePerMinute: z
    .number({ message: 'El precio debe ser un número válido' })
    .gt(0, 'El precio debe ser mayor a 0 €/min'),
  description: z.string().optional(),
  active: z.boolean(),
})

export type TariffFormData = z.infer<typeof tariffSchema>
