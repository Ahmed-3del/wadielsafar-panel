import { useQuery } from '@tanstack/react-query'
import { branchesApi } from '../services/branchesApi'

export function useBranch(id: number | undefined) {
  return useQuery({
    queryKey: ['branches', 'detail', id],
    queryFn: () => branchesApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
