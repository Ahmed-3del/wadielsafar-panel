import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { cruisePortsApi } from '@/services/api/cruises'

export function useCruisePorts(page: number, search: string) {
  return useQuery({
    // The catalogue runs to a hundred rows, so the list page needs a search
    // box — hence the term in the key.
    queryKey: ['cruises', 'ports', 'list', page, search],
    queryFn: () => cruisePortsApi.list({ page, search: search || undefined }),
    placeholderData: keepPreviousData,
  })
}
