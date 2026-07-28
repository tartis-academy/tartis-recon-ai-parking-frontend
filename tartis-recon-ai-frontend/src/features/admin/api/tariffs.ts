import apiClient from '@/lib/api-client'
import type { Tariff, CreateTariffInput, UpdateTariffInput, VehicleType } from '../types/tariff'

const mapTariffDtoToModel = (rawInput: any): Tariff => {
  const raw = Array.isArray(rawInput) ? rawInput[0] : rawInput
  if (!raw) {
    return {
      id: '',
      name: '',
      type: 'CAR',
      basePrice: 0,
      pricePerMinute: 0,
      active: false,
    }
  }
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    type: raw.type ?? 'CAR',
    basePrice: Number(raw.basePrice ?? raw.base_price ?? 0),
    pricePerMinute: Number(raw.pricePerMinute ?? raw.price_per_minute ?? 0),
    active: Boolean(raw.active),
  }
}

export const getTariffs = async (): Promise<Tariff[]> => {
  const response = await apiClient.get<any[]>('/v1/tariffs')
  return (response.data ?? []).map(mapTariffDtoToModel)
}

export const getActiveTariff = async (type: VehicleType): Promise<Tariff> => {
  const response = await apiClient.get<any>('/v1/tariffs/active', {
    params: { type },
  })
  const data = Array.isArray(response.data) ? response.data[0] : response.data
  return mapTariffDtoToModel(data)
}

export const createTariff = async (data: CreateTariffInput): Promise<Tariff> => {
  const response = await apiClient.post<any>('/v1/tariffs', data)
  return mapTariffDtoToModel(response.data)
}

export const updateTariff = async (id: string, data: UpdateTariffInput): Promise<Tariff> => {
  const response = await apiClient.put<any>(`/v1/tariffs/${id}`, data)
  return mapTariffDtoToModel(response.data)
}

export const toggleTariffStatus = async (id: string, active: boolean): Promise<Tariff> => {
  const response = await apiClient.patch<any>(`/v1/tariffs/${id}/status`, { active })
  return mapTariffDtoToModel(response.data)
}

export const deleteTariff = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/tariffs/${id}`)
}

