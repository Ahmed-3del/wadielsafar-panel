import { z } from 'zod'

export const certificateSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  issuer_ar: z.string(),
  issuer_en: z.string(),
  reference_number: z.string(),
  // Both optional: a licence with a badge and no document is still worth
  // showing, and so is one with a document and no badge.
  image: z.string(),
  document: z.union([
    z.literal(''),
    z.string().url('Enter a full URL to the PDF, or leave it blank'),
  ]),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type CertificateFormValues = z.infer<typeof certificateSchema>
