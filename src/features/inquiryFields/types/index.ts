export const INQUIRY_FIELD_TYPES = [
  { value: 'TEXT', label: 'Short text' },
  { value: 'TEXTAREA', label: 'Long text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'DATE', label: 'Date' },
  { value: 'SELECT', label: 'Choice from a list' },
  { value: 'STEPPER', label: 'Count with − and + buttons' },
  { value: 'SEGMENTED', label: 'Choice laid out as buttons' },
  { value: 'CHECKBOX', label: 'Several choices at once' },
  { value: 'AIRPORT', label: 'Airport search (keeps the code)' },
  { value: 'CITY', label: 'City search' },
] as const

/** The types that show a list of options. */
export const OPTION_TYPES = ['SELECT', 'SEGMENTED', 'CHECKBOX'] as const

export type InquiryFieldType = (typeof INQUIRY_FIELD_TYPES)[number]['value']

/**
 * One extra question the website's contact form asks for one service.
 *
 * The answer is filed under `key` in the inquiry's details, which is why the
 * key is a slug and unique per service — it is effectively a column name in
 * everything that reads an inquiry back.
 */
export interface InquiryField {
  id: number
  service_type: string
  key: string
  label_ar: string
  label_en: string
  field_type: InquiryFieldType
  placeholder_ar: string
  placeholder_en: string
  /** One option per line, the two languages read in step. */
  options_ar: string
  options_en: string
  /** Served zipped by the API; read-only here. */
  options: { ar: string; en: string }[]
  is_required: boolean
  /** Bounds for a count. */
  min_value: number | null
  max_value: number | null
  /** Dates: refuse anything before today. */
  not_past: boolean
  /** Dates: another question's key, which this one cannot precede. */
  not_before: string
  /** Show this only while another question holds this answer, matched against
   *  the English option so one rule covers both languages. */
  show_when_key: string
  show_when_value: string
  is_wide: boolean
  /** Consecutive questions sharing a heading become one titled block. */
  group_ar: string
  group_en: string
  order: number
  is_active: boolean
}

export type InquiryFieldWrite = Omit<InquiryField, 'id' | 'options'>
