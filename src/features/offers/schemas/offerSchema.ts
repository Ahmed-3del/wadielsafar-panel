import { z } from 'zod'
import { optionalDecimalString } from '@/utils/formValues'

// `status` and `discount_percentage` are computed server-side and are deliberately absent:
// the form must never write them back.
export const offerSchema = z
  .object({
    title_ar: z.string().min(1, 'Arabic title is required'),
    title_en: z.string().min(1, 'English title is required'),
    description_ar: z.string(),
    description_en: z.string(),
    service_type: z.enum(['FLIGHT', 'HOTEL', 'PACKAGE', 'VISA', 'CRUISE', 'CORPORATE', 'OTHER']),
    price_before: optionalDecimalString,
    price_after: optionalDecimalString,
    image: z.string(),
    starts_at: z.string().min(1, 'Start date is required'),
    ends_at: z.string().min(1, 'End date is required'),
    is_featured: z.boolean(),
    is_active: z.boolean(),
  })
  // Mirrors the serializer's cross-field rules so the user sees them before the round trip.
  .superRefine((values, ctx) => {
    if (values.starts_at && values.ends_at && values.ends_at < values.starts_at) {
      ctx.addIssue({
        code: 'custom',
        path: ['ends_at'],
        message: 'End date cannot be before the start date.',
      })
    }
    if (
      values.price_before !== '' &&
      values.price_after !== '' &&
      Number(values.price_after) > Number(values.price_before)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['price_after'],
        message: 'Discounted price cannot exceed the original price.',
      })
    }
  })

export type OfferFormValues = z.infer<typeof offerSchema>
