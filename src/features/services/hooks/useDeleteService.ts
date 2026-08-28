import { useMutation, useQueryClient } from '@tanstack/react-query'
import { servicesApi } from '../services/servicesApi'

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => servicesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
