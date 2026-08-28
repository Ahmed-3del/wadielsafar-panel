import { useQuery } from '@tanstack/react-query'
import { destinationsApi } from '@/services/api/destinations'

/**
 * Powers the destination <select> in the hotel form. Shares the query key used by the
 * package form so both screens hit one cache entry instead of refetching the same list.
 */
export function useDestinationOptions() {
  return useQuery({
    queryKey: ['destinations', 'options'],
    queryFn: () => destinationsApi.list({ page: 1 }),
  })
}
