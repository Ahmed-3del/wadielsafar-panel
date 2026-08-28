import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '../services/mediaApi'

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => mediaApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
