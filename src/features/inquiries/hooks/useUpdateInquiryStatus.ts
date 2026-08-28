import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { inquiriesApi } from '../services/inquiriesApi'
import type { InquiryStatus } from '../types'

export function useUpdateInquiryStatus(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: InquiryStatus) => inquiriesApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['inquiries', 'detail', id], updated)
      void queryClient.invalidateQueries({ queryKey: ['inquiries', 'list'] })
      showToast('Inquiry status updated.')
    },
    onError: (error: unknown) => {
      showToast(extractErrorMessage(error), 'error')
    },
  })
}
