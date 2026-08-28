import { useQuery } from '@tanstack/react-query'
import { airportsApi } from '../services/airportsApi'

export function useAirport(id: number | undefined) {
  return useQuery({
    queryKey: ['airports', 'detail', id],
    queryFn: () => airportsApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
