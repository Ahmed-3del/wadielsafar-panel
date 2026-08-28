import { z } from 'zod'

export const hotelSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  /** Plain strings tied to <select> DOM values — converted to numeric ids at submit time. */
  destination_id: z.string().min(1, 'Destination is required'),
  star_rating: z.string().min(1, 'Star rating is required'),
  address_ar: z.string(),
  address_en: z.string(),
  description_ar: z.string(),
  description_en: z.string(),
  amenity_ids: z.array(z.string()),
  price_per_night_from: z.number().min(0, 'Price must be zero or greater'),
  cover_image: z.string(),
  check_in_time: z.string(),
  check_out_time: z.string(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
})

export type HotelFormValues = z.infer<typeof hotelSchema>
