import { z } from 'zod'

export const partnerSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  logo: z.string(),
  // Optional on purpose: plenty of partners have no site worth linking to, and
  // a dead link on a logo wall is worse than no link.
  website_url: z.union([z.literal(''), z.string().url('Enter a full URL, or leave it blank')]),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type PartnerFormValues = z.infer<typeof partnerSchema>
