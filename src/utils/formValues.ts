import { z } from 'zod'

/**
 * Fields the API stores as nullable numbers stay strings while bound to a DOM input:
 * `valueAsNumber` turns a cleared input into NaN, which cannot round-trip back to null.
 * They are converted with `toNullableNumber` at submit time.
 */
export const optionalDecimalString = z
  .string()
  .refine(
    (value) => value === '' || (value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0),
    'Enter a non-negative number',
  )

export const optionalIntegerString = z
  .string()
  .refine(
    (value) => value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0),
    'Enter a whole number of zero or more',
  )

export function toNullableNumber(value: string): number | null {
  return value === '' ? null : Number(value)
}

export function toNullableString(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}
