import { z } from 'zod'

export const tariffSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  vehicleType: z.enum(['CAR', 'CAR_PMR', 'MOTORBIKE']),
  pricePerMinute: z
    .number({ message: 'El precio por minuto debe ser un número válido' })
    .gt(0, 'El precio por minuto debe ser mayor a 0 €/min'),
  basePrice: z
    .number({ message: 'El precio base debe ser un número válido' })
    .min(0, 'El precio base no puede ser negativo'),
  active: z.boolean(),
})

export type TariffFormData = z.infer<typeof tariffSchema>
