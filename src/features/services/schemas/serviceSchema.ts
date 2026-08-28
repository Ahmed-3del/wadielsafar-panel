import { z } from 'zod'

export const serviceSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  description_ar: z.string(),
  description_en: z.string(),
  icon: z.string().max(50, 'Icon key must be 50 characters or fewer'),
  image: z.string(),
  order: z.number().int('Order must be a whole number').min(0, 'Order must be zero or greater'),
  is_active: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
