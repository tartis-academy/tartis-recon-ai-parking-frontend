import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTariff } from '../api/tariffs'
import type { UpdateTariffInput } from '../types/tariff'

interface UpdateTariffParams {
  id: string
  data: UpdateTariffInput
}

export function useUpdateTariff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateTariffParams) => updateTariff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] })
    },
  })
}
