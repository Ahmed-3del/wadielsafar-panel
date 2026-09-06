import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promotionsApi } from '../services/promotionsApi'
import type { PromotionWrite } from '../types'

export function useSavePromotion(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PromotionWrite) =>
      id ? promotionsApi.update(id, payload) : promotionsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}
