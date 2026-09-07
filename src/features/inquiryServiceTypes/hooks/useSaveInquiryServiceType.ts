import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inquiryServiceTypesApi } from '@/services/api/inquiryServiceTypes'
import type { InquiryServiceTypeWrite } from '../types'

export function useSaveInquiryServiceType(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InquiryServiceTypeWrite) =>
      id ? inquiryServiceTypesApi.update(id, payload) : inquiryServiceTypesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['inquiryServiceTypes'] })
    },
  })
}
