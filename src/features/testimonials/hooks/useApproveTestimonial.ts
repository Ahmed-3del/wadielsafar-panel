import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { testimonialsApi } from '../services/testimonialsApi'

export function useApproveTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => testimonialsApi.approve(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(['testimonials', 'detail', updated.id], updated)
      // The list is filtered by approval state, so the approved row may have to leave the page.
      void queryClient.invalidateQueries({ queryKey: ['testimonials', 'list'] })
      // The dashboard shows a pending-approval count that this action just changed.
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast('Testimonial approved.')
    },
    onError: (error: unknown) => {
      showToast(extractErrorMessage(error), 'error')
    },
  })
}
