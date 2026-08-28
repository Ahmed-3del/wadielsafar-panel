export interface Certificate {
  id: number
  name_ar: string
  name_en: string
  issuer_ar: string
  issuer_en: string
  reference_number: string
  image: string | null
  document: string
  order: number
  is_active: boolean
}

export type CertificateWrite = Omit<Certificate, 'id'>
