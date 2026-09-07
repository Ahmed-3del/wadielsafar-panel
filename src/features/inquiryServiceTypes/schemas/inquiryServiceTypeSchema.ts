import { z } from 'zod'
import { SERVICE_TYPES } from '@/features/inquiries/types'

export const inquiryServiceTypeSchema = z.object({
  // Fixed on purpose — see the note on the type.
  value: z.enum(SERVICE_TYPES as [string, ...string[]]),
  label_ar: z.string().min(1, 'Arabic wording is required'),
  label_en: z.string().min(1, 'English wording is required'),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type InquiryServiceTypeFormValues = z.infer<typeof inquiryServiceTypeSchema>
