import { createCrudApi } from '@/services/api/client'
import type { FlightDeal, FlightDealWrite } from '@/features/flights/types'

/** Detail routes are keyed by `slug`, not `id` — callers must pass `row.slug`. */
export const flightsApi = createCrudApi<FlightDeal, FlightDealWrite>('flights')
