import { z } from 'zod'

export const branchSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  // Matches the backend's validator, so the message arrives before the round
  // trip does.
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, 'International format with no spaces, e.g. +966115602558'),
  phone_display: z.string(),
  address_ar: z.string(),
  address_en: z.string(),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type BranchFormValues = z.infer<typeof branchSchema>
