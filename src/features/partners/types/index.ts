export interface Partner {
  id: number
  name_ar: string
  name_en: string
  logo: string | null
  website_url: string
  order: number
  is_active: boolean
}

export type PartnerWrite = Omit<Partner, 'id'>
