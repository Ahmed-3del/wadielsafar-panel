import { useQuery } from '@tanstack/react-query'
import { testimonialsApi } from '../services/testimonialsApi'

export function useTestimonial(id: number | undefined) {
  return useQuery({
    queryKey: ['testimonials', 'detail', id],
    queryFn: () => testimonialsApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
