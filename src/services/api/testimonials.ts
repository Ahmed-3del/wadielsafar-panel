import { apiClient, createCrudApi } from '@/services/api/client'
import type {
  Testimonial,
  TestimonialFilters,
  TestimonialWrite,
} from '@/features/testimonials/types'
import type { ListParams, PaginatedResponse } from '@/types'

const base = createCrudApi<Testimonial, TestimonialWrite>('testimonials')

export const testimonialsApi = {
  ...base,
  list: (params?: ListParams & TestimonialFilters) =>
    apiClient
      .get<PaginatedResponse<Testimonial>>('/testimonials/', { params })
      .then((res) => res.data),
  /** Staff-only moderation action; returns the updated testimonial. */
  approve: (id: number) =>
    apiClient.post<Testimonial>(`/testimonials/${id}/approve/`).then((res) => res.data),
}
