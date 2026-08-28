import { useMutation, useQueryClient } from '@tanstack/react-query'
import { offersApi } from '../services/offersApi'
import type { OfferWrite } from '../types'

export function useSaveOffer(slug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: OfferWrite) =>
      slug ? offersApi.update(slug, payload) : offersApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })
}
