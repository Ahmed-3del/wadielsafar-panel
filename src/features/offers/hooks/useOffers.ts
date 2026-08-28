import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { offersApi } from '../services/offersApi'

export function useOffers(page: number) {
  return useQuery({
    queryKey: ['offers', 'list', page],
    queryFn: () => offersApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
