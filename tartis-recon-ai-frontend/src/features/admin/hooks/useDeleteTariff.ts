import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTariff } from '../api/tariffs'

export function useDeleteTariff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTariff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] })
    },
  })
}
