import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { flightsApi } from '../services/flightsApi'

export function useFlights(page: number) {
  return useQuery({
    queryKey: ['flights', 'list', page],
    queryFn: () => flightsApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
