import apiClient from '@/lib/api-client'
import type { Tariff, CreateTariffInput } from '../types/tariff'

export const getTariffs = async (): Promise<Tariff[]> => {
  const response = await apiClient.get<Tariff[]>('/v1/tariffs')
  return response.data
}

export const createTariff = async (data: CreateTariffInput): Promise<Tariff> => {
  const response = await apiClient.post<Tariff>('/v1/tariffs', data)
  return response.data
}
