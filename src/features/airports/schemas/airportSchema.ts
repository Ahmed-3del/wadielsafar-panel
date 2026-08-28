import { z } from 'zod'

export const airportSchema = z.object({
  // Three letters, normalized to upper case by the API on save. Validated here
  // too so the message arrives before the round trip does.
  iata_code: z
    .string()
    .regex(/^[A-Za-z]{3}$/, 'Three letters, e.g. JED'),
  name_ar: z.string().min(1, 'Arabic airport name is required'),
  name_en: z.string().min(1, 'English airport name is required'),
  city_ar: z.string().min(1, 'Arabic city is required'),
  city_en: z.string().min(1, 'English city is required'),
  country_ar: z.string().min(1, 'Arabic country is required'),
  country_en: z.string().min(1, 'English country is required'),
  // Optional: the flag beside the row is the only thing that uses it.
  country_code: z.union([z.literal(''), z.string().regex(/^[A-Za-z]{2}$/, 'Two letters, e.g. SA')]),
  is_popular: z.boolean(),
  is_active: z.boolean(),
  order: z.number().int().min(0),
})

export type AirportFormValues = z.infer<typeof airportSchema>
