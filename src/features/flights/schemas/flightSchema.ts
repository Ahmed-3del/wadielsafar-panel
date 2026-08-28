import { z } from 'zod'
import { optionalIntegerString } from '@/utils/formValues'

const iataCode = z
  .string()
  .regex(/^[A-Za-z]{3}$/, 'Must be a 3-letter IATA code')

export const flightSchema = z
  .object({
    title_ar: z.string().min(1, 'Arabic title is required'),
    title_en: z.string().min(1, 'English title is required'),
    origin_city_ar: z.string().min(1, 'Arabic origin city is required'),
    origin_city_en: z.string().min(1, 'English origin city is required'),
    origin_airport_code: iataCode,
    destination_city_ar: z.string().min(1, 'Arabic destination city is required'),
    destination_city_en: z.string().min(1, 'English destination city is required'),
    destination_airport_code: iataCode,
    airline_name_ar: z.string(),
    airline_name_en: z.string(),
    airline_logo: z.string(),
    trip_type: z.enum(['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY']),
    cabin_class: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
    price_from: z.number().min(0, 'Price must be zero or greater'),
    departure_date: z.string(),
    return_date: z.string(),
    baggage_allowance_kg: optionalIntegerString,
    is_featured: z.boolean(),
    is_active: z.boolean(),
  })
  // Mirrors the serializer's cross-field rules so the user sees them before the round trip.
  .superRefine((values, ctx) => {
    if (values.departure_date && values.return_date && values.return_date < values.departure_date) {
      ctx.addIssue({
        code: 'custom',
        path: ['return_date'],
        message: 'Return date cannot be before the departure date.',
      })
    }
    if (values.trip_type === 'ROUND_TRIP' && values.departure_date && !values.return_date) {
      ctx.addIssue({
        code: 'custom',
        path: ['return_date'],
        message: 'A round trip needs a return date.',
      })
    }
  })

export type FlightFormValues = z.infer<typeof flightSchema>
