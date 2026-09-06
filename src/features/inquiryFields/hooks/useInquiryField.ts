import { useQuery } from '@tanstack/react-query'
import { inquiryFieldsApi } from '@/services/api/inquiryFields'

export function useInquiryField(id: number | undefined) {
  return useQuery({
    queryKey: ['inquiryFields', 'detail', id],
    queryFn: () => inquiryFieldsApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
