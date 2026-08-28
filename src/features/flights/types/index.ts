export type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY'

export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'

export const TRIP_TYPES: TripType[] = ['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY']

export const CABIN_CLASSES: CabinClass[] = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']

export interface FlightDeal {
  id: number
  title_ar: string
  title_en: string
  slug: string
  origin_city_ar: string
  origin_city_en: string
  origin_airport_code: string
  destination_city_ar: string
  destination_city_en: string
  destination_airport_code: string
  airline_name_ar: string
  airline_name_en: string
  airline_logo: string | null
  trip_type: TripType
  cabin_class: CabinClass
  price_from: string
  currency: string
  departure_date: string | null
  return_date: string | null
  baggage_allowance_kg: number | null
  is_featured: boolean
  is_active: boolean
}

// Read returns decimals as strings and dates as nullable; writes send plain numbers/nulls
// (matches apps/flights/serializers/flight_deal.py).
export interface FlightDealWrite {
  title_ar: string
  title_en: string
  origin_city_ar: string
  origin_city_en: string
  origin_airport_code: string
  destination_city_ar: string
  destination_city_en: string
  destination_airport_code: string
  airline_name_ar: string
  airline_name_en: string
  airline_logo: string | null
  trip_type: TripType
  cabin_class: CabinClass
  price_from: number
  departure_date: string | null
  return_date: string | null
  baggage_allowance_kg: number | null
  is_featured: boolean
  is_active: boolean
}
