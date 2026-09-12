import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promoBarApi } from '@/services/api/promoBar'
import type { PromoBarWrite } from '../types'

export function useSavePromoBar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PromoBarWrite) => promoBarApi.update(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-bar'] })
    },
  })
}
