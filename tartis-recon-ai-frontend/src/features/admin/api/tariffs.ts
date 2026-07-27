import apiClient from '@/lib/api-client'
import type { Tariff, CreateTariffInput, UpdateTariffInput } from '../types/tariff'

export const getTariffs = async (): Promise<Tariff[]> => {
  const response = await apiClient.get<Tariff[]>('/v1/tariffs')
  return response.data
}

export const createTariff = async (data: CreateTariffInput): Promise<Tariff> => {
  const response = await apiClient.post<Tariff>('/v1/tariffs', data)
  return response.data
}

export const updateTariff = async (id: string, data: UpdateTariffInput): Promise<Tariff> => {
  const response = await apiClient.put<Tariff>(`/v1/tariffs/${id}`, data)
  return response.data
}

export const toggleTariffStatus = async (id: string, active: boolean): Promise<Tariff> => {
  const response = await apiClient.patch<Tariff>(`/v1/tariffs/${id}/status`, { active })
  return response.data
}

export const deleteTariff = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/tariffs/${id}`)
}
