import { z } from 'zod'

export const promoBarSchema = z.object({
  headline_ar: z.string().min(1, 'Arabic headline is required'),
  headline_en: z.string().min(1, 'English headline is required'),
  code: z.string(),
  cta_label_ar: z.string().min(1, 'Arabic button text is required'),
  cta_label_en: z.string().min(1, 'English button text is required'),
  // The website renders this through its localised Link, which prefixes the
  // language — an absolute URL would come out as /ar/https://example.com.
  link: z
    .string()
    .refine((value) => value === '' || value.startsWith('/'), 'Start with / — e.g. /packages'),
  is_active: z.boolean(),
})

export type PromoBarFormValues = z.infer<typeof promoBarSchema>
