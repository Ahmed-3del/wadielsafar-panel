export interface HomeSection {
  id: number
  key: string
  /** Human name, supplied by the API so this list and the site agree. */
  label: string
  order: number
  is_active: boolean
}
