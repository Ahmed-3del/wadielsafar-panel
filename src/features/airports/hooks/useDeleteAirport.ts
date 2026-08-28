import { useMutation, useQueryClient } from '@tanstack/react-query'
import { airportsApi } from '../services/airportsApi'

export function useDeleteAirport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => airportsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['airports'] })
    },
  })
}
