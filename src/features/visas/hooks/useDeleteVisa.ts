import { useMutation, useQueryClient } from '@tanstack/react-query'
import { visasApi } from '../services/visasApi'

export function useDeleteVisa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => visasApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['visas'] })
    },
  })
}
