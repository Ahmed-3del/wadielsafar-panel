import { useMutation, useQueryClient } from '@tanstack/react-query'
import { branchesApi } from '../services/branchesApi'
import type { BranchWrite } from '../types'

export function useSaveBranch(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BranchWrite) =>
      id ? branchesApi.update(id, payload) : branchesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}
