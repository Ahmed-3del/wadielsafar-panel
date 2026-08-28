import { useMutation, useQueryClient } from '@tanstack/react-query'
import { partnersApi } from '../services/partnersApi'
import type { PartnerWrite } from '../types'

export function useSavePartner(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PartnerWrite) =>
      id ? partnersApi.update(id, payload) : partnersApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
