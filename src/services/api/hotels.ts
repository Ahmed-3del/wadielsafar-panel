import { createCrudApi } from '@/services/api/client'
import type { Hotel, HotelAmenity, HotelWrite } from '@/features/hotels/types'

/** Detail routes are keyed by `slug`, not `id` — callers must pass `row.slug`. */
export const hotelsApi = createCrudApi<Hotel, HotelWrite>('hotels')

/** Amenities are a sibling collection under the hotels route and are keyed by `id`. */
export const hotelAmenitiesApi = createCrudApi<HotelAmenity>('hotels/amenities')
