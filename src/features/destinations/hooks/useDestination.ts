import { useQuery } from '@tanstack/react-query'
import { destinationsApi } from '../services/destinationsApi'

/** Destination detail routes are keyed by slug, matching the API's lookup_field. */
export function useDestination(slug: string | undefined) {
  return useQuery({
    queryKey: ['destinations', 'detail', slug],
    queryFn: () => destinationsApi.retrieve(slug as string),
    enabled: slug !== undefined,
  })
}
