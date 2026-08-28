import { useMutation, useQueryClient } from '@tanstack/react-query'
import { partnersApi } from '../services/partnersApi'

export function useDeletePartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => partnersApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
