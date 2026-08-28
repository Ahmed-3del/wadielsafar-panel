import { useMutation, useQueryClient } from '@tanstack/react-query'
import { offersApi } from '../services/offersApi'

export function useDeleteOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => offersApi.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })
}
