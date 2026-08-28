import { useMutation, useQueryClient } from '@tanstack/react-query'
import { visasApi } from '../services/visasApi'
import type { VisaTypeWrite } from '../types'

export function useSaveVisa(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VisaTypeWrite) => (id ? visasApi.update(id, payload) : visasApi.create(payload)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['visas'] })
    },
  })
}
