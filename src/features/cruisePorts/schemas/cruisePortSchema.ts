import { z } from 'zod'

export const cruisePortSchema = z.object({
  // The natural key the website's search sends. Lower case and hyphens so it
  // survives a URL untouched.
  code: z
    .string()
    .min(2, 'A code is required')
    .regex(/^[a-z0-9-]+$/, 'Lower-case letters, numbers and hyphens only'),
  name_ar: z.string().min(1, 'Arabic port name is required'),
  name_en: z.string().min(1, 'English port name is required'),
  city_ar: z.string().min(1, 'Arabic city is required'),
  city_en: z.string().min(1, 'English city is required'),
  country_ar: z.string().min(1, 'Arabic country is required'),
  country_en: z.string().min(1, 'English country is required'),
  country_code: z
    .string()
    .regex(/^[A-Za-z]{2}$/, 'Two letters, e.g. AE')
    .or(z.literal('')),
  is_popular: z.boolean(),
  is_active: z.boolean(),
  order: z.number().int().min(0),
})

export type CruisePortFormValues = z.infer<typeof cruisePortSchema>
