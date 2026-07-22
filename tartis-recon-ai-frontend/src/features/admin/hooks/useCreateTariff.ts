import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTariff } from '../api/tariffs'
import type { CreateTariffInput } from '../types/tariff'

export function useCreateTariff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTariffInput) => createTariff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] })
    },
  })
}
