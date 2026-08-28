import { describe, expect, it } from 'vitest'
import { destinationSchema } from './destinationSchema'

const baseDestination = {
  name_ar: 'دبي',
  name_en: 'Dubai',
  description_ar: '',
  description_en: '',
  country_ar: 'الإمارات العربية المتحدة',
  country_en: 'United Arab Emirates',
  cover_image: '',
  is_active: true,
}

function firstIssuePath(input: Record<string, unknown>) {
  const result = destinationSchema.safeParse(input)
  expect(result.success).toBe(false)
  return result.success ? undefined : result.error.issues[0]?.path
}

describe('destinationSchema', () => {
  /*
   * The model declares description blank=True. When this schema required one,
   * every destination created without a description could be opened in the
   * panel but never saved — including the ones the API itself had accepted.
   */
  it('accepts a destination with no description, matching the API', () => {
    expect(destinationSchema.safeParse(baseDestination).success).toBe(true)
  })

  it('requires the country in both languages', () => {
    expect(firstIssuePath({ ...baseDestination, country_ar: '' })).toEqual(['country_ar'])
    expect(firstIssuePath({ ...baseDestination, country_en: '' })).toEqual(['country_en'])
  })

  it('requires the name in both languages', () => {
    expect(firstIssuePath({ ...baseDestination, name_ar: '' })).toEqual(['name_ar'])
    expect(firstIssuePath({ ...baseDestination, name_en: '' })).toEqual(['name_en'])
  })
})
