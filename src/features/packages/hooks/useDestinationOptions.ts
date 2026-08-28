import { useQuery } from '@tanstack/react-query'
import { destinationsApi } from '@/services/api/destinations'

/** Powers the destination <select> in the package form — proves cross-feature reuse of the shared api layer. */
export function useDestinationOptions() {
  return useQuery({
    queryKey: ['destinations', 'options'],
    queryFn: () => destinationsApi.list({ page: 1 }),
  })
}
