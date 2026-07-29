import apiClient from '@/lib/api-client'
import type { AxiosRequestConfig } from 'axios'
import type {
  CheckInRequest,
  CheckInResponse,
  CheckOutRequest,
  CheckOutResponse,
} from '../types/stay'

const STAY_SERVICE_URL = import.meta.env.VITE_STAY_SERVICE_URL || '/v1/stays'

export const stayService = {
  async checkIn(payload: CheckInRequest, config?: AxiosRequestConfig): Promise<CheckInResponse> {
    const response = await apiClient.post<CheckInResponse>(
      `${STAY_SERVICE_URL}/check-in`,
      payload,
      ...(config ? [config] : []),
    )
    return response.data
  },

  async checkOut(payload: CheckOutRequest, config?: AxiosRequestConfig): Promise<CheckOutResponse> {
    const response = await apiClient.post<CheckOutResponse>(
      `${STAY_SERVICE_URL}/check-out`,
      payload,
      ...(config ? [config] : []),
    )
    return response.data
  },
}

export default stayService
