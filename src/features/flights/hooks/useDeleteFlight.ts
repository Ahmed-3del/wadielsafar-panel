import { useMutation, useQueryClient } from '@tanstack/react-query'
import { flightsApi } from '../services/flightsApi'

export function useDeleteFlight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => flightsApi.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['flights'] })
    },
  })
}
