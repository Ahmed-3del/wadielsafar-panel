import { createCrudApi } from '@/services/api/client'
import type {
  InquiryServiceType,
  InquiryServiceTypeWrite,
} from '@/features/inquiryServiceTypes/types'

export const inquiryServiceTypesApi = createCrudApi<InquiryServiceType, InquiryServiceTypeWrite>(
  'inquiries/service-types',
)
