export interface Branch {
  id: number
  name_ar: string
  name_en: string
  phone: string
  phone_display: string
  address_ar: string
  address_en: string
  order: number
  is_active: boolean
}

export type BranchWrite = Omit<Branch, 'id'>
