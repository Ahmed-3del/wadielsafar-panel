import { z } from 'zod'
import { SERVICE_TYPES } from '@/features/inquiries/types'

export const serviceSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  description_ar: z.string(),
  description_en: z.string(),
  icon: z.string().max(50, 'Icon key must be 50 characters or fewer'),
  // The website renders this through its localised Link, which prefixes the
  // language — an absolute URL would come out as /ar/https://example.com.
  link: z
    .string()
    .refine((value) => value === '' || value.startsWith('/'), 'Start with / — e.g. /visas'),
  image: z.string(),
  // Blank is allowed and means "leave the form on its own default".
  service_type: z.enum(['', ...SERVICE_TYPES] as [string, ...string[]]),
  order: z.number().int('Order must be a whole number').min(0, 'Order must be zero or greater'),
  is_active: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
