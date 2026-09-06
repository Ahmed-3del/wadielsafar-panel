import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inquiryFieldsApi } from '@/services/api/inquiryFields'

export function useDeleteInquiryField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inquiryFieldsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['inquiryFields'] })
    },
  })
}
