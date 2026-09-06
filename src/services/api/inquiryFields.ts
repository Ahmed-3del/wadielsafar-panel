import { createCrudApi } from '@/services/api/client'
import type { InquiryField, InquiryFieldWrite } from '@/features/inquiryFields/types'

export const inquiryFieldsApi = createCrudApi<InquiryField, InquiryFieldWrite>('inquiries/fields')
