import { useMemo } from 'react'
import { SearchSelect, type SearchSelectOption } from './SearchSelect'
import { useAirportOptions } from '@/features/airports/hooks/useAirportOptions'
import type { Airport } from '@/features/airports/types'

interface AirportFieldProps {
  id: string
  /** The IATA code, which is what the flight columns store. */
  value: string
  /** Fired with the whole airport on a pick, so the caller can fill the city
   *  names from the same choice. */
  onPick: (airport: Airport) => void
  /** Free text, for an airport the catalogue has not got yet. */
  onType: (value: string) => void
  onBlur?: () => void
  hasError?: boolean
}

/*
 * Picks an airport out of the shipped catalogue — the same catalogue the
 * website's departure and arrival boxes read from.
 *
 * Typing the code by hand was the problem: a flight deal saved with "DXP"
 * instead of "DXB" still saves, still lists, and simply never matches anything
 * a traveller searches for.
 */
export function AirportField({ id, value, onPick, onType, onBlur, hasError }: AirportFieldProps) {
  const { data } = useAirportOptions()
  const airports = useMemo(() => data?.results ?? [], [data])

  const options = useMemo<SearchSelectOption[]>(
    () =>
      airports.map((airport) => ({
        value: airport.iata_code,
        label: `${airport.city_en} (${airport.iata_code})`,
        hint: `${airport.name_en} — ${airport.country_en}`,
        // So an Arabic search finds an English row: the catalogue carries both
        // and whoever is typing may well be typing "جدة".
        keywords: `${airport.city_ar} ${airport.name_ar} ${airport.country_ar}`,
        image: airport.country_code
          ? `https://flagcdn.com/w40/${airport.country_code.toLowerCase()}.png`
          : undefined,
        preferred: airport.is_popular,
      })),
    [airports],
  )

  return (
    <SearchSelect
      id={id}
      value={value}
      options={options}
      placeholder="City, airport or code…"
      hasError={hasError}
      onBlur={onBlur}
      onChange={(next, option) => {
        if (!option) {
          onType(next.toUpperCase())
          return
        }
        const airport = airports.find((row) => row.iata_code === option.value)
        if (airport) onPick(airport)
      }}
    />
  )
}
