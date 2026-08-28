import type { Destination } from '@/features/destinations/types'

export interface Cruise {
  id: number
  title_ar: string
  title_en: string
  slug: string
  cruise_line_ar: string
  cruise_line_en: string
  destination: Destination | null
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
