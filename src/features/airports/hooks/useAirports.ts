import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { airportsApi } from '../services/airportsApi'

export function useAirports(page: number, search: string) {
  return useQuery({
    // The catalogue runs to 176 rows, so the list page is unusable without a
    // search box — hence the term in the key.
    queryKey: ['airports', 'list', page, search],
    queryFn: () => airportsApi.list({ page, search: search || undefined }),
    placeholderData: keepPreviousData,
  })
}
