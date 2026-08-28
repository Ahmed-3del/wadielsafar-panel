import { useQuery } from '@tanstack/react-query'
import { inquiriesApi } from '../services/inquiriesApi'

export function useInquiry(id: number) {
  return useQuery({
    queryKey: ['inquiries', 'detail', id],
    queryFn: () => inquiriesApi.retrieve(id),
    enabled: Number.isFinite(id),
  })
}
