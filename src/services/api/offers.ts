import { createCrudApi } from '@/services/api/client'
import type { Offer, OfferWrite } from '@/features/offers/types'

/** Detail routes are keyed by `slug`, not `id` — callers must pass `row.slug`. */
export const offersApi = createCrudApi<Offer, OfferWrite>('offers')
