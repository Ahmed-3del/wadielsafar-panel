import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelsApi } from '../services/hotelsApi'

export function useDeleteHotel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => hotelsApi.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}
