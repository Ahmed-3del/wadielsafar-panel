import { describe, expect, it } from 'vitest'
import { offerSchema } from './offerSchema'

const baseOffer = {
  title_ar: 'عرض',
  title_en: 'Offer',
  description_ar: '',
  description_en: '',
  service_type: 'PACKAGE',
  price_before: '',
  price_after: '',
  image: '',
  starts_at: '2026-09-01',
  ends_at: '2026-09-30',
  is_featured: false,
  is_active: true,
}

function firstIssuePath(input: Record<string, unknown>) {
  const result = offerSchema.safeParse(input)
  expect(result.success).toBe(false)
  return result.success ? undefined : result.error.issues[0]?.path
}

describe('offerSchema', () => {
  it('accepts an offer with a valid window and no prices', () => {
    expect(offerSchema.safeParse(baseOffer).success).toBe(true)
  })

  it('rejects an end date before the start date', () => {
    expect(firstIssuePath({ ...baseOffer, ends_at: '2026-08-01' })).toEqual(['ends_at'])
  })

  it('accepts a window that starts and ends on the same day', () => {
    expect(offerSchema.safeParse({ ...baseOffer, ends_at: baseOffer.starts_at }).success).toBe(true)
  })

  it('rejects a discounted price above the original price', () => {
    const input = { ...baseOffer, price_before: '100', price_after: '150' }
    expect(firstIssuePath(input)).toEqual(['price_after'])
  })

  it('allows a discounted price on its own, since the pair is optional', () => {
    expect(offerSchema.safeParse({ ...baseOffer, price_after: '150' }).success).toBe(true)
  })

  it('rejects a non-numeric price', () => {
    expect(firstIssuePath({ ...baseOffer, price_before: 'free' })).toEqual(['price_before'])
  })

  it('requires both dates', () => {
    expect(firstIssuePath({ ...baseOffer, starts_at: '' })).toEqual(['starts_at'])
  })
})
