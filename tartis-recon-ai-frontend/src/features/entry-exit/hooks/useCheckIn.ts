import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { stayService } from '../api/stayService'
import type { CheckInRequest, CheckInResponse } from '../types/stay'

export function useCheckIn(): UseMutationResult<CheckInResponse, Error, CheckInRequest> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CheckInRequest) => {
      try {
        return await stayService.checkIn(payload, { skipToast: true })
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 409) {
          throw new Error('No hay plazas libres')
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] })
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })
}
