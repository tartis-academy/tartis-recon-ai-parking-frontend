import { useQuery } from '@tanstack/react-query'
import { getSpots } from '../api/spots'

export const useSpots = () => {
  return useQuery({
    queryKey: ['spots'],
    queryFn: getSpots,
  })
}
