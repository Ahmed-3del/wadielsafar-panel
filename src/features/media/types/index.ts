export type MediaKind = 'IMAGE' | 'VIDEO' | 'OTHER'

export interface MediaAsset {
  id: number
  /** Absolute or root-relative URL served by the API. */
  file: string
  /** Derived from the extension by the API, so the panel need not guess. */
  kind: MediaKind
  alt_text_ar: string
  alt_text_en: string
  uploaded_by: number | null
  created_at: string
}
