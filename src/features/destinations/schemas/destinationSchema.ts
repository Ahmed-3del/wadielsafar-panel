import { z } from 'zod'

export const destinationSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  description_ar: z.string(),
  description_en: z.string(),
  country_ar: z.string().min(1, 'Arabic country is required'),
  country_en: z.string().min(1, 'English country is required'),
  cover_image: z.string(),
  is_active: z.boolean(),
})

export type DestinationFormValues = z.infer<typeof destinationSchema>
