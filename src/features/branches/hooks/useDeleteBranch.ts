import { useMutation, useQueryClient } from '@tanstack/react-query'
import { branchesApi } from '../services/branchesApi'

export function useDeleteBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => branchesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}
