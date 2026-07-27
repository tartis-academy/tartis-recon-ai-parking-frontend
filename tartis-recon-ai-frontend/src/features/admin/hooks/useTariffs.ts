import { useQuery } from '@tanstack/react-query'
import { getTariffs } from '../api/tariffs'

export function useTariffs() {
  return useQuery({
    queryKey: ['tariffs'],
    queryFn: getTariffs,
  })
}
