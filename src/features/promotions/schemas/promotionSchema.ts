import { z } from 'zod'
import { PROMOTION_ICONS } from '../types'

export const promotionSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().min(1, 'English title is required'),
  description_ar: z.string(),
  description_en: z.string(),
  badge_ar: z.string(),
  badge_en: z.string(),
  code: z.string(),
  /*
   * A local datetime as the browser's picker gives it, or blank. Blank is a
   * real answer — a standing offer with no announced end — and the website
   * then shows the card without a countdown rather than inventing a deadline.
   */
  ends_at: z.string(),
  icon: z.enum(PROMOTION_ICONS),
  // The website renders this through its localised Link, which prefixes the
  // language — an absolute URL would come out as /ar/https://example.com.
  link: z
    .string()
    .refine((value) => value === '' || value.startsWith('/'), 'Start with / — e.g. /packages'),
  cta_label_ar: z.string().max(60),
  cta_label_en: z.string().max(60),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type PromotionFormValues = z.infer<typeof promotionSchema>
