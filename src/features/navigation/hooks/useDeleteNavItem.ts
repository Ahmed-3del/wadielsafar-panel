import { useMutation, useQueryClient } from '@tanstack/react-query'
import { navigationApi } from '../services/navigationApi'

export function useDeleteNavItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => navigationApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['navigation'] })
    },
  })
}
