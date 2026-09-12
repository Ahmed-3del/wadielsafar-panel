export interface VisaCountry {
  id: number
  name_ar: string
  name_en: string
  flag_image: string | null
  /** A photograph of the country. Heads every visa card it issues. */
  cover_image: string | null
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

/** How many times the visa lets you in. Blank where it varies by applicant —
 *  a wrong answer here sends someone to an embassy for nothing. */
export type VisaEntry = '' | 'SINGLE' | 'MULTIPLE'

export const VISA_ENTRY_TYPES: { value: VisaEntry; label: string }[] = [
  { value: '', label: 'Unspecified' },
  { value: 'SINGLE', label: 'Single entry' },
  { value: 'MULTIPLE', label: 'Multiple entry' },
]

export interface VisaType {
  id: number
  country: VisaCountry
  name_ar: string
  name_en: string
  purpose: VisaPurpose
  entry_type: VisaEntry
  /** Overrides the country photo for this one visa. */
  cover_image: string | null
  requirements_ar: string
  requirements_en: string
  price: string
  processing_time_days: number
  validity_days: number | null
  /** Shown in the homepage's own visa rail. */
  is_featured: boolean
  is_active: boolean
}

export type VisaCountryWrite = Omit<VisaCountry, 'id'>

// The read shape nests country; writes send country_id instead (matches
// apps/visas/serializers/visa_type.py's country_id write-only field).
export interface VisaTypeWrite {
  country_id: number
  name_ar: string
  name_en: string
  purpose: VisaPurpose
  entry_type: VisaEntry
  /** Overrides the country photo for this one visa. */
  cover_image: string | null
  requirements_ar: string
  requirements_en: string
  price: number
  processing_time_days: number
  validity_days: number | null
  is_featured: boolean
  is_active: boolean
}
