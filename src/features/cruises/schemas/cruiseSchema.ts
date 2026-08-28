import { z } from 'zod'

export const cruiseSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().min(1, 'English title is required'),
  cruise_line_ar: z.string(),
  cruise_line_en: z.string(),
  /** Plain string tied to the <select>; '' means no destination. */
  destination_id: z.string(),
  departure_port_ar: z.string(),
  departure_port_en: z.string(),
  description_ar: z.string(),
  description_en: z.string(),
  departure_date: z.string(),
  duration_nights: z.number().int().min(1, 'Must be at least one night'),
  price_from: z.number().min(0, 'Price must be zero or greater'),
  cover_image: z.string(),
  included_services_ar: z.string(),
  included_services_en: z.string(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
})

export type CruiseFormValues = z.infer<typeof cruiseSchema>
