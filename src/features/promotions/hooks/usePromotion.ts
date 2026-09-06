import { useQuery } from '@tanstack/react-query'
import { promotionsApi } from '../services/promotionsApi'

export function usePromotion(id: number | undefined) {
  return useQuery({
    queryKey: ['promotions', 'detail', id],
    queryFn: () => promotionsApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
