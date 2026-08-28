import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { destinationsApi } from '../services/destinationsApi'

export function useDestinations(page: number) {
  return useQuery({
    queryKey: ['destinations', 'list', page],
    queryFn: () => destinationsApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
