import { useMutation, useQueryClient } from '@tanstack/react-query'
import { destinationsApi } from '../services/destinationsApi'

export function useDeleteDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => destinationsApi.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['destinations'] })
    },
  })
}
