import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cruisePortsApi } from '@/services/api/cruises'

export function useDeleteCruisePort() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cruisePortsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cruises'] })
    },
  })
}
