import { z } from 'zod'

export const visaCountrySchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  flag_image: z.string(),
  cover_image: z.string(),
  is_active: z.boolean(),
})

export type VisaCountryFormValues = z.infer<typeof visaCountrySchema>
