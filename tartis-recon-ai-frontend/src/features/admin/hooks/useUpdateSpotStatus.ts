import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSpotStatus } from '../api/spots'
import type { SpotStatus } from '../types/spot'

export const useUpdateSpotStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SpotStatus }) => updateSpotStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })
}
