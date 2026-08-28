import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { cruisesApi } from '../services/cruisesApi'

export function useCruises(page = 1) {
  return useQuery({
    queryKey: ['cruises', 'list', page],
    queryFn: () => cruisesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
