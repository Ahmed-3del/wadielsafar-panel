import type { ServiceType } from '@/features/inquiries/types'

export interface Testimonial {
  id: number
  customer_name: string
  customer_title_ar: string
  customer_title_en: string
  content_ar: string
  content_en: string
  rating: number
  avatar_image: string | null
  service_type: ServiceType | null
  /** Defaults to false — flipped only through the dedicated approve action. */
  is_approved: boolean
  is_visible: boolean
  order: number
}

// `is_approved` is owned by the approve endpoint, not by the edit form.
export interface TestimonialWrite {
  customer_name: string
  customer_title_ar: string
  customer_title_en: string
  content_ar: string
  content_en: string
  rating: number
  avatar_image: string | null
  service_type: ServiceType | null
  is_visible: boolean
  order: number
}

export interface TestimonialFilters {
  is_approved?: 'true' | 'false'
}

export const RATINGS = [1, 2, 3, 4, 5] as const
