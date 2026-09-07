import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { inquiryServiceTypesApi } from '@/services/api/inquiryServiceTypes'

export function useInquiryServiceTypes(page = 1) {
  return useQuery({
    queryKey: ['inquiryServiceTypes', 'list', page],
    queryFn: () => inquiryServiceTypesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
