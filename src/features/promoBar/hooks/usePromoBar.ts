import { useQuery } from '@tanstack/react-query'
import { promoBarApi } from '@/services/api/promoBar'

export function usePromoBar() {
  return useQuery({
    queryKey: ['promo-bar'],
    queryFn: promoBarApi.retrieve,
  })
}
