import { useQuery } from '@tanstack/react-query'
import { offersApi } from '../services/offersApi'

/** Offer detail routes are keyed by slug. */
export function useOffer(slug: string | undefined) {
  return useQuery({
    queryKey: ['offers', 'detail', slug],
    queryFn: () => offersApi.retrieve(slug as string),
    enabled: slug !== undefined,
  })
}
