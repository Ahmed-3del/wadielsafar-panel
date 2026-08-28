import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { inquiriesApi } from '../services/inquiriesApi'
import type { InquiryFilters } from '../types'

export function useInquiries(filters: InquiryFilters, page: number) {
  return useQuery({
    queryKey: ['inquiries', 'list', filters, page],
    queryFn: () => inquiriesApi.list({ ...filters, page }),
    placeholderData: keepPreviousData,
  })
}
