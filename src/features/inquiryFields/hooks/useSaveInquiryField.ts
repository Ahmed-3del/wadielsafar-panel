import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inquiryFieldsApi } from '@/services/api/inquiryFields'
import type { InquiryFieldWrite } from '../types'

export function useSaveInquiryField(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InquiryFieldWrite) =>
      id ? inquiryFieldsApi.update(id, payload) : inquiryFieldsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['inquiryFields'] })
    },
  })
}
