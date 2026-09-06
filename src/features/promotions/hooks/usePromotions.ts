import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { promotionsApi } from '../services/promotionsApi'

export function usePromotions(page: number) {
  return useQuery({
    queryKey: ['promotions', 'list', page],
    queryFn: () => promotionsApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
