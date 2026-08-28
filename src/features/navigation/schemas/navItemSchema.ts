import { z } from 'zod'

export const navItemSchema = z.object({
  label_ar: z.string().min(1, 'Arabic label is required'),
  label_en: z.string().min(1, 'English label is required'),
  href: z
    .string()
    .min(1, 'Path is required')
    .refine((v) => v.startsWith('/'), 'Must start with / — for example /packages')
    .refine((v) => !v.startsWith('//'), 'Must be a path on this site, not another host'),
  group: z.enum(['PRIMARY', 'SECONDARY']),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type NavItemFormValues = z.infer<typeof navItemSchema>
