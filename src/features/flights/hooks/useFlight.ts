import { useQuery } from '@tanstack/react-query'
import { flightsApi } from '../services/flightsApi'

/** Flight detail routes are keyed by slug. */
export function useFlight(slug: string | undefined) {
  return useQuery({
    queryKey: ['flights', 'detail', slug],
    queryFn: () => flightsApi.retrieve(slug as string),
    enabled: slug !== undefined,
  })
}
