import { useMutation, useQueryClient } from '@tanstack/react-query'
import { testimonialsApi } from '../services/testimonialsApi'
import type { TestimonialWrite } from '../types'

export function useSaveTestimonial(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TestimonialWrite) =>
      id ? testimonialsApi.update(id, payload) : testimonialsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
