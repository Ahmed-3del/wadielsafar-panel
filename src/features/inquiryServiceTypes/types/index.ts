import type { ServiceType } from '@/features/inquiries/types'

/**
 * One entry in the "Service needed" list on the website's contact form.
 *
 * The value is fixed: it is the column every enquiry is filed under and the
 * one the Inquiries screen filters by, so a made-up one would file enquiries
 * somewhere nothing can read back. What is editable is everything a visitor
 * sees — the wording, the order, and whether it is offered at all.
 */
export interface InquiryServiceType {
  id: number
  value: ServiceType
  label_ar: string
  label_en: string
  order: number
  is_active: boolean
}

export type InquiryServiceTypeWrite = Omit<InquiryServiceType, 'id'>
