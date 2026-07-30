import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleTariffStatus } from '../api/tariffs'

export function useToggleTariffStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleTariffStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] })
    },
  })
}
