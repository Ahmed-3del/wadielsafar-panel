import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { hotelsApi } from '../services/hotelsApi'

export function useHotels(page: number) {
  return useQuery({
    queryKey: ['hotels', 'list', page],
    queryFn: () => hotelsApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
