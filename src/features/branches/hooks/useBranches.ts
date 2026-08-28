import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { branchesApi } from '../services/branchesApi'

export function useBranches(page: number) {
  return useQuery({
    queryKey: ['branches', 'list', page],
    queryFn: () => branchesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
