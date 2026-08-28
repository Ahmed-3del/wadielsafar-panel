import type { ServiceType } from '@/features/inquiries/types'

export type OfferStatus = 'SCHEDULED' | 'ACTIVE' | 'EXPIRED'

/** `status` is derived from the validity window by the backend, so the panel only maps it to a tone. */
export const OFFER_STATUS_TONE: Record<OfferStatus, 'success' | 'info' | 'neutral'> = {
  ACTIVE: 'success',
  SCHEDULED: 'info',
  EXPIRED: 'neutral',
}

export interface Offer {
  id: number
  title_ar: string
  title_en: string
  slug: string
  description_ar: string
  description_en: string
  service_type: ServiceType
  price_before: string | null
  price_after: string | null
  /** Read-only, computed from the price pair. Null when either price is missing. */
  discount_percentage: number | null
  image: string | null
  starts_at: string
  ends_at: string
  /** Read-only, computed from the validity window. */
  status: OfferStatus
  is_featured: boolean
  is_active: boolean
}

// `status` and `discount_percentage` are computed server-side and are deliberately absent here —
// they must never appear in a write payload.
export interface OfferWrite {
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  service_type: ServiceType
  price_before: number | null
  price_after: number | null
  image: string | null
  starts_at: string
  ends_at: string
  is_featured: boolean
  is_active: boolean
}
