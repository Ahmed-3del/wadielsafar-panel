import type { InquiryStatus, ServiceType } from '@/features/inquiries/types'

export interface RecentInquiry {
  id: number
  name: string
  service_type: ServiceType
  status: InquiryStatus
  created_at: string
}

export interface DashboardStats {
  inquiries: {
    total: number
    new: number
    by_status: Record<InquiryStatus, number>
    /** The five newest inquiries. */
    recent: RecentInquiry[]
  }
  content: {
    destinations: number
    packages: number
    hotels: number
    flights: number
    visas: number
    offers: number
    testimonials: number
  }
  testimonials: {
    pending_approval: number
  }
}
