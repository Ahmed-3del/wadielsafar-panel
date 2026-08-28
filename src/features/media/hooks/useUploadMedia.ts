import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '../services/mediaApi'

interface UploadInput {
  file: File
  altTextAr: string
  altTextEn: string
}

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, altTextAr, altTextEn }: UploadInput) =>
      mediaApi.upload(file, altTextAr, altTextEn),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
