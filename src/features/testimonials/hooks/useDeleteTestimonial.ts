import { useMutation, useQueryClient } from '@tanstack/react-query'
import { testimonialsApi } from '../services/testimonialsApi'

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => testimonialsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
