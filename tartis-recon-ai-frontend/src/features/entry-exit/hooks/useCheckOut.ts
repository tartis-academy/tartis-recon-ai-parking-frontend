import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { stayService } from '../api/stayService'
import type { CheckOutRequest, CheckOutResponse } from '../types/stay'

export function useCheckOut(): UseMutationResult<CheckOutResponse, Error, CheckOutRequest> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CheckOutRequest) => {
      // Use skipToast: true to let the local UI component handle the error message display
      return await stayService.checkOut(payload, { skipToast: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] })
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })
}
