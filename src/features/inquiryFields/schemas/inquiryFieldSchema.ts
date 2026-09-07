import { z } from 'zod'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import { OPTION_TYPES } from '../types'



const lines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

export const inquiryFieldSchema = z
  .object({
    // Blank is allowed here, because a question can belong to one service
    // instead of to a type. The pair is checked below.
    service_type: z.enum(['', ...SERVICE_TYPES] as [string, ...string[]]),
    service: z.number().int().nullable(),
    // The answer is filed under this name, so it behaves like a column: lower
    // case, no spaces, and it should not change once enquiries carry it.
    key: z
      .string()
      .min(2, 'A key is required')
      .regex(/^[a-z0-9_-]+$/, 'Lower-case letters, numbers, hyphens and underscores only'),
    label_ar: z.string().min(1, 'Arabic label is required'),
    label_en: z.string().min(1, 'English label is required'),
    field_type: z.enum([
      'TEXT',
      'TEXTAREA',
      'NUMBER',
      'DATE',
      'SELECT',
      'STEPPER',
      'SEGMENTED',
      'CHECKBOX',
      'AIRPORT',
      'CITY',
    ]),
    placeholder_ar: z.string(),
    placeholder_en: z.string(),
    options_ar: z.string(),
    options_en: z.string(),
    is_required: z.boolean(),
    // Blank stays blank: an empty box means "no bound", not zero.
    min_value: z.number().int().min(0).nullable(),
    max_value: z.number().int().min(0).nullable(),
    not_past: z.boolean(),
    not_before: z.string(),
    show_when_key: z.string(),
    show_when_value: z.string(),
    is_wide: z.boolean(),
    group_ar: z.string(),
    group_en: z.string(),
    order: z.number().int().min(0),
    is_active: z.boolean(),
  })
  // A question has to belong to something, or nothing would ever ask it.
  .superRefine((values, ctx) => {
    if (!values.service && !values.service_type) {
      ctx.addIssue({
        code: 'custom',
        path: ['service_type'],
        message: 'Pick the service, or the service type, this question belongs to',
      })
    }
  })
  // A count with its bounds the wrong way round would leave the − and +
  // buttons unable to reach anything.
  .superRefine((values, ctx) => {
    if (values.min_value !== null && values.max_value !== null && values.min_value > values.max_value) {
      ctx.addIssue({ code: 'custom', path: ['max_value'], message: 'The largest count cannot be below the smallest' })
    }
  })
  // The website zips the two option lists by position, so a missing line in
  // one language would put an Arabic label on an English answer. The API
  // refuses it too; catching it here saves the round trip.
  .superRefine((values, ctx) => {
    if (!OPTION_TYPES.includes(values.field_type as (typeof OPTION_TYPES)[number])) return
    const arabic = lines(values.options_ar)
    const english = lines(values.options_en)
    if (arabic.length === 0 || english.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['options_en'],
        message: 'A choice field needs its options, one per line, in both languages',
      })
      return
    }
    if (arabic.length !== english.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['options_en'],
        message: `Both languages need the same number of options — ${arabic.length} in Arabic, ${english.length} in English`,
      })
    }
  })

export type InquiryFieldFormValues = z.infer<typeof inquiryFieldSchema>
