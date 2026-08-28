import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { packagesApi } from '../services/packagesApi'

export function usePackages(page: number) {
  return useQuery({
    queryKey: ['packages', 'list', page],
    queryFn: () => packagesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
