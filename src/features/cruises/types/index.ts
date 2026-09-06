import type { Destination } from '@/features/destinations/types'

/** A port ships sail from. Reference data, shared with the website's cruise
 *  search — that search asks for a country and then one of its ports. */
export interface CruisePort {
  id: number
  /** Natural key, and what the website's search sends. */
  code: string
  name_ar: string
  name_en: string
  city_ar: string
  city_en: string
  country_ar: string
  country_en: string
  /** ISO 3166-1 alpha-2. Groups the ports by country and draws the flag. */
  country_code: string
  is_popular: boolean
  is_active: boolean
  order: number
}

export type CruisePortWrite = Omit<CruisePort, 'id'>

export interface Cruise {
  id: number
  title_ar: string
  title_en: string
  slug: string
  cruise_line_ar: string
  cruise_line_en: string
  destination: Destination | null
  /** The linked port. Null on a sailing nobody has linked, which is why the
   *  two text fields stay: they are what the website's card prints. */
  departure_port: CruisePort | null
  departure_port_ar: string
  departure_port_en: string
  description_ar: string
  description_en: string
  departure_date: string | null
  duration_nights: number
  price_from: string
  currency: string
  cover_image: string | null
  included_services_ar: string
  included_services_en: string
  is_featured: boolean
  is_active: boolean
}

// Reads nest the destination; writes send destination_id.
export interface CruiseWrite {
  title_ar: string
  title_en: string
  cruise_line_ar: string
  cruise_line_en: string
  destination_id: number | null
  /** Null clears the link. The website can only answer "sailing from Italy"
   *  for cruises that have one. */
  departure_port_id: number | null
  departure_port_ar: string
  departure_port_en: string
  description_ar: string
  description_en: string
  departure_date: string | null
  duration_nights: number
  price_from: number
  cover_image: string | null
  included_services_ar: string
  included_services_en: string
  is_featured: boolean
  is_active: boolean
}
