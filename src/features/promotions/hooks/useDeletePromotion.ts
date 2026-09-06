import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promotionsApi } from '../services/promotionsApi'

export function useDeletePromotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => promotionsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}
