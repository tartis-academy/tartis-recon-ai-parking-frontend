import { z } from 'zod'

export const tariffSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  type: z.enum(['CAR', 'CAR_PMR', 'MOTORBIKE']),
  basePrice: z
    .number({ message: 'El precio base debe ser un número válido' })
    .min(0, 'El precio base debe ser mayor o igual a 0 €'),
  pricePerMinute: z
    .number({ message: 'El precio por minuto debe ser un número válido' })
    .gt(0, 'El precio por minuto debe ser mayor a 0 €/min'),
  active: z.boolean(),
})

export type TariffFormData = z.infer<typeof tariffSchema>
