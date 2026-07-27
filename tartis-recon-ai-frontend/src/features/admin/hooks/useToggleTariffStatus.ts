import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleTariffStatus } from '../api/tariffs'

export function useToggleTariffStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleTariffStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] })
    },
  })
}
