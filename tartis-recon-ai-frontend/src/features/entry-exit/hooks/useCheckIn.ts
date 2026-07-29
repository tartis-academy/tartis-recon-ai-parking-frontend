import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { stayService } from '../api/stayService'
import type { CheckInRequest, CheckInResponse } from '../types/stay'

export function useCheckIn(): UseMutationResult<CheckInResponse, Error, CheckInRequest> {
  return useMutation({
    mutationFn: async (payload: CheckInRequest) => {
      try {
        return await stayService.checkIn(payload)
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 409) {
          throw new Error('No hay plazas libres')
        }
        throw error
      }
    },
  })
}
