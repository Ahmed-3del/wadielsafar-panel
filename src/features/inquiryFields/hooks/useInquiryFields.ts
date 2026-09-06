import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { inquiryFieldsApi } from '@/services/api/inquiryFields'

export function useInquiryFields(page: number, serviceType: string) {
  return useQuery({
    queryKey: ['inquiryFields', 'list', page, serviceType],
    queryFn: () =>
      inquiryFieldsApi.list({ page, service_type: serviceType || undefined }),
    placeholderData: keepPreviousData,
  })
}
