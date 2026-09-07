import { useQuery } from '@tanstack/react-query'
import { inquiryServiceTypesApi } from '@/services/api/inquiryServiceTypes'

export function useInquiryServiceType(id: number | undefined) {
  return useQuery({
    queryKey: ['inquiryServiceTypes', 'detail', id],
    queryFn: () => inquiryServiceTypesApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
