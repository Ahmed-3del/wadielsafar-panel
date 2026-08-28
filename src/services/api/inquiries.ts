import { apiClient, createCrudApi } from '@/services/api/client'
import type { Inquiry, InquiryFilters, InquiryStatus } from '@/features/inquiries/types'
import type { ListParams, PaginatedResponse } from '@/types'

const base = createCrudApi<Inquiry>('inquiries')

export const inquiriesApi = {
  ...base,
  list: (params?: ListParams & InquiryFilters) =>
    apiClient
      .get<PaginatedResponse<Inquiry>>('/inquiries/', { params })
      .then((res) => res.data),
  updateStatus: (id: number, status: InquiryStatus) =>
    apiClient.patch<Inquiry>(`/inquiries/${id}/`, { status }).then((res) => res.data),
}
