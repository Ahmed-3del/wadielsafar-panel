import { z } from 'zod'

export const visaSchema = z.object({
  /** Plain string tied to the <select> DOM value — converted to a numeric id at submit time. */
  country_id: z.string().min(1, 'Country is required'),
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  purpose: z.enum(['', 'TOURISM', 'BUSINESS', 'STUDY', 'UMRAH', 'OTHER']),
  requirements_ar: z.string(),
  requirements_en: z.string(),
  price: z.number().min(0, 'Price must be zero or greater'),
  processing_time_days: z.number().int().min(0, 'Must be zero or greater'),
  /** Optional: some visas vary by applicant, and a wrong number is worse than none. */
  validity_days: z.string(),
  is_active: z.boolean(),
})

export type VisaFormValues = z.infer<typeof visaSchema>
