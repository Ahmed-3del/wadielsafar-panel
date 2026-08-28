export interface Airport {
  id: number
  iata_code: string
  name_ar: string
  name_en: string
  city_ar: string
  city_en: string
  country_ar: string
  country_en: string
  country_code: string
  is_popular: boolean
  is_active: boolean
  order: number
}

export type AirportWrite = Omit<Airport, 'id'>
