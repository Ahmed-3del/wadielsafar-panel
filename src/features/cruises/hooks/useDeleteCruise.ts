import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cruisesApi } from '../services/cruisesApi'

export function useDeleteCruise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => cruisesApi.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cruises'] })
    },
  })
}
