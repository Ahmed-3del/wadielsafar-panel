export type ServiceType = 'FLIGHT' | 'HOTEL' | 'PACKAGE' | 'VISA' | 'CRUISE' | 'CORPORATE' | 'OTHER'

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED'

export interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  service_type: ServiceType
  destination: number | null
  travel_date: string | null
  message: string
  status: InquiryStatus
  source: string
  /** Service-specific request data captured by the website request forms. */
  details: Record<string, string | number | boolean | null>
  created_at: string
}

export interface InquiryFilters {
  status?: InquiryStatus
  service_type?: ServiceType
}

export const INQUIRY_STATUSES: InquiryStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'CLOSED',
]

export const SERVICE_TYPES: ServiceType[] = [
  'FLIGHT',
  'HOTEL',
  'PACKAGE',
  'VISA',
  'CRUISE',
  'CORPORATE',
  'OTHER',
]
