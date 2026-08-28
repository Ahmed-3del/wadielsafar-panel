import type { Destination } from '@/features/destinations/types'

export interface HotelAmenity {
  id: number
  name_ar: string
  name_en: string
  slug: string
  icon: string
}

export const STAR_RATINGS = [1, 2, 3, 4, 5] as const

export interface Hotel {
  id: number
  name_ar: string
  name_en: string
  slug: string
  destination: Destination
  star_rating: number
  address_ar: string
  address_en: string
  description_ar: string
  description_en: string
  amenities: HotelAmenity[]
  price_per_night_from: string
  currency: string
  cover_image: string | null
  check_in_time: string | null
  check_out_time: string | null
  is_featured: boolean
  is_active: boolean
}

// The read shape nests destination and amenities; writes send destination_id and
// amenity_ids instead (matches apps/hotels/serializers/hotel.py's write-only fields).
export interface HotelWrite {
  name_ar: string
  name_en: string
  destination_id: number
  star_rating: number
  address_ar: string
  address_en: string
  description_ar: string
  description_en: string
  amenity_ids: number[]
  price_per_night_from: number
  cover_image: string | null
  check_in_time: string | null
  check_out_time: string | null
  is_featured: boolean
  is_active: boolean
}
