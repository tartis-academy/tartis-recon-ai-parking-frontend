import axios from 'axios'
import apiClient from '@/lib/api-client'
import type { Tariff, CreateTariffInput, UpdateTariffInput, VehicleType } from '../types/tariff'

interface TariffDTO {
  id?: string
  name?: string
  type?: VehicleType
  basePrice?: number
  base_price?: number
  pricePerMinute?: number
  price_per_minute?: number
  active?: boolean
}

const mapTariffDtoToModel = (rawInput: unknown): Tariff | null => {
  const raw = Array.isArray(rawInput) ? rawInput[0] as TariffDTO : rawInput as TariffDTO
  if (!raw || (!raw.id && !raw.name)) {
    return null
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
  const response = await apiClient.get<TariffDTO[]>('/v1/tariffs')
  const mapped = (response.data ?? []).map(mapTariffDtoToModel)
  return mapped.filter((item): item is Tariff => item !== null)
}

export const getActiveTariff = async (type: VehicleType): Promise<Tariff | null> => {
  try {
    const response = await apiClient.get<TariffDTO | TariffDTO[]>('/v1/tariffs/active', {
      params: { type },
      skipToast: true,
    })
    const data = Array.isArray(response.data) ? response.data[0] : response.data
    return mapTariffDtoToModel(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export const createTariff = async (data: CreateTariffInput): Promise<Tariff> => {
  const response = await apiClient.post<TariffDTO>('/v1/tariffs', data)
  const mapped = mapTariffDtoToModel(response.data)
  if (!mapped) throw new Error('Error al procesar la respuesta de la tarifa')
  return mapped
}

export const updateTariff = async (id: string, data: UpdateTariffInput): Promise<Tariff> => {
  const response = await apiClient.put<TariffDTO>(`/v1/tariffs/${id}`, data)
  const mapped = mapTariffDtoToModel(response.data)
  if (!mapped) throw new Error('Error al procesar la respuesta de la tarifa')
  return mapped
}

export const toggleTariffStatus = async (id: string, active: boolean): Promise<Tariff> => {
  const response = await apiClient.patch<TariffDTO>(`/v1/tariffs/${id}/status`, { active })
  const mapped = mapTariffDtoToModel(response.data)
  if (!mapped) throw new Error('Error al procesar la respuesta de la tarifa')
  return mapped
}

export const deleteTariff = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/tariffs/${id}`)
}
