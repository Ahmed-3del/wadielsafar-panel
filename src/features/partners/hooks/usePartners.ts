import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { partnersApi } from '../services/partnersApi'

export function usePartners(page: number) {
  return useQuery({
    queryKey: ['partners', 'list', page],
    queryFn: () => partnersApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
