import { apiClient } from '@/services/api/client'
import type { MediaAsset } from '@/features/media/types'
import type { PaginatedResponse, ListParams } from '@/types'

/*
 * Media needs its own client rather than createCrudApi: uploads are multipart,
 * not JSON. Content-Type is left unset on purpose so the browser adds the
 * multipart boundary itself — setting it by hand produces a body the server
 * cannot parse.
 */
export const mediaApi = {
  list: (params?: ListParams) =>
    apiClient.get<PaginatedResponse<MediaAsset>>('/media/', { params }).then((res) => res.data),

  upload: (file: File, altTextAr: string, altTextEn: string) => {
    const body = new FormData()
    body.append('file', file)
    body.append('alt_text_ar', altTextAr)
    body.append('alt_text_en', altTextEn)
    return apiClient.post<MediaAsset>('/media/', body).then((res) => res.data)
  },

  remove: (id: number) => apiClient.delete<void>(`/media/${id}/`).then(() => undefined),
}
