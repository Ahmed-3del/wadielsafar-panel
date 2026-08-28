import { describe, expect, it } from 'vitest'
import { flightSchema } from './flightSchema'

const baseFlight = {
  title_ar: 'رحلة',
  title_en: 'Flight',
  origin_city_ar: 'الرياض',
  origin_city_en: 'Riyadh',
  origin_airport_code: 'RUH',
  destination_city_ar: 'دبي',
  destination_city_en: 'Dubai',
  destination_airport_code: 'DXB',
  airline_name_ar: '',
  airline_name_en: '',
  airline_logo: '',
  trip_type: 'ROUND_TRIP',
  cabin_class: 'ECONOMY',
  price_from: 1250,
  departure_date: '2026-09-15',
  return_date: '2026-09-22',
  baggage_allowance_kg: '30',
  is_featured: false,
  is_active: true,
}

function firstIssuePath(input: Record<string, unknown>) {
  const result = flightSchema.safeParse(input)
  expect(result.success).toBe(false)
  return result.success ? undefined : result.error.issues[0]?.path
}

describe('flightSchema', () => {
  it('accepts a complete round trip', () => {
    expect(flightSchema.safeParse(baseFlight).success).toBe(true)
  })

  it('rejects a return date before the departure date', () => {
    expect(firstIssuePath({ ...baseFlight, return_date: '2026-09-01' })).toEqual(['return_date'])
  })

  it('requires a return date for a round trip with a departure date', () => {
    expect(firstIssuePath({ ...baseFlight, return_date: '' })).toEqual(['return_date'])
  })

  it('allows a one-way trip with no return date', () => {
    const input = { ...baseFlight, trip_type: 'ONE_WAY', return_date: '' }
    expect(flightSchema.safeParse(input).success).toBe(true)
  })

  it('allows a round trip with neither date set, since dates are optional', () => {
    const input = { ...baseFlight, departure_date: '', return_date: '' }
    expect(flightSchema.safeParse(input).success).toBe(true)
  })

  it('rejects an airport code that is not three letters', () => {
    expect(firstIssuePath({ ...baseFlight, origin_airport_code: 'RU' })).toEqual([
      'origin_airport_code',
    ])
  })

  it('rejects a fractional baggage allowance but accepts an empty one', () => {
    expect(firstIssuePath({ ...baseFlight, baggage_allowance_kg: '22.5' })).toEqual([
      'baggage_allowance_kg',
    ])
    expect(flightSchema.safeParse({ ...baseFlight, baggage_allowance_kg: '' }).success).toBe(true)
  })
})
