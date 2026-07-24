import apiClient from '@/lib/api-client'
import type {
  CheckInRequest,
  CheckInResponse,
  CheckOutRequest,
  CheckOutResponse,
} from '@/types/stay'

const TICKET_SERVICE_URL =
  import.meta.env.VITE_TICKET_SERVICE_URL || '/v1/entry-tickets'

export const stayService = {
  async checkIn(payload: CheckInRequest): Promise<CheckInResponse> {
    const response = await apiClient.post<CheckInResponse>(
      TICKET_SERVICE_URL,
      payload,
    )
    return response.data
  },

  async checkOut(payload: CheckOutRequest): Promise<CheckOutResponse> {
    const response = await apiClient.post<CheckOutResponse>(
      `${TICKET_SERVICE_URL}/checkout`,
      payload,
    )
    return response.data
  },
}

export default stayService
