import { z } from 'zod'

// `is_approved` is owned by the approve action, so it is deliberately not a form field.
export const testimonialSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_title_ar: z.string(),
  customer_title_en: z.string(),
  content_ar: z.string().min(1, 'Arabic content is required'),
  content_en: z.string().min(1, 'English content is required'),
  /** Plain string tied to the <select> DOM value — converted to a number at submit time. */
  rating: z.string().min(1, 'Rating is required'),
  avatar_image: z.string(),
  /** Empty string is the "no service type" option; it becomes null on the wire. */
  service_type: z.enum(['', 'FLIGHT', 'HOTEL', 'PACKAGE', 'VISA', 'CRUISE', 'CORPORATE', 'OTHER']),
  is_visible: z.boolean(),
  order: z.number().int('Order must be a whole number').min(0, 'Order must be zero or greater'),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
