export interface VisaCountry {
  id: number
  name_ar: string
  name_en: string
  flag_image: string | null
  is_active: boolean
}

export type VisaPurpose = '' | 'TOURISM' | 'BUSINESS' | 'STUDY' | 'UMRAH' | 'OTHER'

export const VISA_PURPOSES: { value: VisaPurpose; label: string }[] = [
  { value: '', label: 'Unspecified' },
  { value: 'TOURISM', label: 'Tourism' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'STUDY', label: 'Study' },
  { value: 'UMRAH', label: 'Umrah' },
  { value: 'OTHER', label: 'Other' },
]

export interface VisaType {
  id: number
  country: VisaCountry
  name_ar: string
  name_en: string
  purpose: VisaPurpose
  requirements_ar: string
  requirements_en: string
  price: string
  processing_time_days: number
  validity_days: number | null
  is_active: boolean
}

// The read shape nests country; writes send country_id instead (matches
// apps/visas/serializers/visa_type.py's country_id write-only field).
export interface VisaTypeWrite {
  country_id: number
  name_ar: string
  name_en: string
  purpose: VisaPurpose
  requirements_ar: string
  requirements_en: string
  price: number
  processing_time_days: number
  validity_days: number | null
  is_active: boolean
}
