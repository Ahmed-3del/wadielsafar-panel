import { useMemo } from 'react'
import { SearchSelect, type SearchSelectOption } from './SearchSelect'
import { COUNTRIES, PREFERRED_ISO2, flagUrl } from '@/constants/countries'

interface CountryFieldProps {
  id: string
  /** The English country name — what every country column in this system
   *  stores, so it is the value the box round-trips. */
  value: string
  /** Fired with the whole record on a pick, so the caller can fill the Arabic
   *  name and the ISO code from the same choice. */
  onPick: (country: { iso2: string; name_en: string; name_ar: string }) => void
  /** Free text, for a place the list has not got. */
  onType: (value: string) => void
  onBlur?: () => void
  hasError?: boolean
}

/*
 * One country picker, shared by every form that has a country in it.
 *
 * The panel used to ask editors to type the country three times — English,
 * Arabic, and the two-letter code — and to keep the three in step by hand.
 * That is how "Türkiye" and "Turkey" became two countries in one catalogue.
 */
export function CountryField({ id, value, onPick, onType, onBlur, hasError }: CountryFieldProps) {
  const options = useMemo<SearchSelectOption[]>(
    () =>
      COUNTRIES.map((country) => ({
        // Stored by English name, which is what the columns hold.
        value: country.name_en,
        label: country.name_en,
        hint: country.name_ar,
        image: flagUrl(country.iso2),
        keywords: country.iso2,
        preferred: PREFERRED_ISO2.includes(country.iso2),
      })),
    [],
  )

  return (
    <SearchSelect
      id={id}
      value={value}
      options={options}
      placeholder="Search a country…"
      hasError={hasError}
      onBlur={onBlur}
      onChange={(next, option) => {
        if (!option) {
          onType(next)
          return
        }
        const country = COUNTRIES.find((row) => row.name_en === option.value)
        if (country) onPick(country)
      }}
    />
  )
}
