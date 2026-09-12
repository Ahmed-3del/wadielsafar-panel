export interface Branch {
  id: number
  name_ar: string
  name_en: string
  phone: string
  phone_display: string
  address_ar: string
  address_en: string
  /** A photo of the office. Blank shows the map preview in its place. */
  cover_image: string | null
  /** Free text, e.g. "Sat–Thu: 9am–9pm". Blank hides the row on the card. */
  working_hours_ar: string
  working_hours_en: string
  /** Decimal degrees, as strings. Null when nobody has dropped the pin: the
   *  site then prints the address without a map rather than a map of nowhere. */
  latitude: string | null
  longitude: string | null
  /** Pasted from Google Maps' own Share button. Blank makes "view on map"
   *  search by name and address instead of opening this branch's real
   *  listing directly. */
  google_maps_url: string
  /** The head office. The site gives it a gold border and a badge. */
  is_main: boolean
  order: number
  is_active: boolean
}

export type BranchWrite = Omit<Branch, 'id'>
