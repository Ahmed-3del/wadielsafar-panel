import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { testimonialsApi } from '../services/testimonialsApi'
import type { TestimonialFilters } from '../types'

export function useTestimonials(filters: TestimonialFilters, page: number) {
  return useQuery({
    queryKey: ['testimonials', 'list', filters, page],
    queryFn: () => testimonialsApi.list({ ...filters, page }),
    placeholderData: keepPreviousData,
  })
}
