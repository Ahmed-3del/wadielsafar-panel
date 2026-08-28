import type { Destination } from '@/features/destinations/types'

export interface PackageCategory {
  id: number
  name_ar: string
  name_en: string
  slug: string
}

export interface Package {
  id: number
  title_ar: string
  title_en: string
  slug: string
  category: PackageCategory
  destination: Destination
  description_ar: string
  description_en: string
  duration_days: number
  included_services_ar: string
  included_services_en: string
  price_from: string
  cover_image: string | null
  is_featured: boolean
  is_active: boolean
}

// The read shape nests category/destination; writes send their ids instead
// (matches apps/packages/serializers/package.py's category_id/destination_id
// write-only fields).
export interface PackageWrite {
  title_ar: string
  title_en: string
  category_id: number
  destination_id: number
  description_ar: string
  description_en: string
  duration_days: number
  included_services_ar: string
  included_services_en: string
  price_from: number
  cover_image: string | null
  is_featured: boolean
  is_active: boolean
}
