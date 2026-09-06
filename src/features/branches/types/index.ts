export interface Branch {
  id: number
  name_ar: string
  name_en: string
  phone: string
  phone_display: string
  address_ar: string
  address_en: string
  /** Decimal degrees, as strings. Null when nobody has dropped the pin: the
   *  site then prints the address without a map rather than a map of nowhere. */
  latitude: string | null
  longitude: string | null
  /** The head office. The site gives it a gold border and a badge. */
  is_main: boolean
  order: number
  is_active: boolean
}

export type BranchWrite = Omit<Branch, 'id'>
