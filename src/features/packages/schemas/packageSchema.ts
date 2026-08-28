import { z } from 'zod'

export const packageSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().min(1, 'English title is required'),
  /** Plain strings tied to <select> DOM values — converted to numeric ids at submit time. */
  category_id: z.string().min(1, 'Category is required'),
  destination_id: z.string().min(1, 'Destination is required'),
  description_ar: z.string(),
  description_en: z.string(),
  duration_days: z.number().int().min(1, 'Must be at least 1 day'),
  included_services_ar: z.string(),
  included_services_en: z.string(),
  price_from: z.number().min(0, 'Price must be zero or greater'),
  cover_image: z.string(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
})

export type PackageFormValues = z.infer<typeof packageSchema>
