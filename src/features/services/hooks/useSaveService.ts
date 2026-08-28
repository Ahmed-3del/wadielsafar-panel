import { useMutation, useQueryClient } from '@tanstack/react-query'
import { servicesApi } from '../services/servicesApi'
import type { ServiceWrite } from '../types'

export function useSaveService(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ServiceWrite) =>
      id ? servicesApi.update(id, payload) : servicesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
