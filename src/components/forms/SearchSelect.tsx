import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from '@/components/ui'

export interface SearchSelectOption {
  /** What gets written back on pick. Also the key. */
  value: string
  /** The line the user reads. */
  label: string
  /** Second line — a country under a city, say. */
  hint?: string
  /** Small square image, e.g. a flag. */
  image?: string
  /** Searched but never shown. The panel's UI is English while its data is
   *  bilingual, so "دبي" has to find Dubai even though the row reads in
   *  English. */
  keywords?: string
  /** Everything below the search box before anyone types is a "preferred"
   *  row; the rest appears once there is a query. */
  preferred?: boolean
}

interface SearchSelectProps {
  id: string
  /** The current value, which is not required to be one of the options. */
  value: string
  onChange: (value: string, option?: SearchSelectOption) => void
  onBlur?: () => void
  options: SearchSelectOption[]
  placeholder?: string
  hasError?: boolean
  /** Let someone keep a value that matches nothing — an airport the catalogue
   *  has not got yet, say. Off means the box resets to the last real pick. */
  allowCustom?: boolean
}

/** Folds the Arabic the panel is full of, so "الإمارات" matches "الامارات" and
 *  a search does not depend on which hamza someone typed. */
function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/*
 * A text box that filters a list — for the fields where the panel used to ask
 * an editor to type a country or an airport by hand.
 *
 * Typing free text was how "Türkiye" and "Turkey" ended up as two countries in
 * the same catalogue, and how an airport code could be saved with a typo that
 * the website then failed to match. The box still accepts anything (a new
 * airport has to be enterable before it is in the list), but the list is
 * always there and one click fills every related field at once.
 */
export function SearchSelect({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  hasError,
  allowCustom = true,
}: SearchSelectProps) {
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // The label of whatever is currently selected, so the closed box reads as a
  // name rather than as the code that is actually stored.
  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )
  const text = open ? query : (selected?.label ?? value)

  const matches = useMemo(() => {
    const needle = fold(query)
    if (!needle) {
      const preferred = options.filter((option) => option.preferred)
      return (preferred.length > 0 ? preferred : options).slice(0, 50)
    }
    return options
      .filter((option) => {
        const haystack = fold(
          `${option.label} ${option.hint ?? ''} ${option.keywords ?? ''} ${option.value}`,
        )
        return haystack.includes(needle)
      })
      .slice(0, 50)
  }, [options, query])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const pick = (option: SearchSelectOption) => {
    onChange(option.value, option)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setActive((current) => {
        const next = event.key === 'ArrowDown' ? current + 1 : current - 1
        return Math.max(0, Math.min(next, matches.length - 1))
      })
      return
    }
    if (event.key === 'Enter' && open && matches[active]) {
      event.preventDefault()
      pick(matches[active])
      return
    }
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <Input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        hasError={hasError}
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          const next = event.target.value
          setQuery(next)
          setActive(0)
          setOpen(true)
          // Free text is committed as it is typed, so a value the list has
          // never heard of still saves.
          if (allowCustom) onChange(next)
        }}
        onFocus={() => {
          setQuery('')
          setOpen(true)
        }}
        onBlur={() => {
          // Tabbing away has to close the list; a click on an option cannot
          // lose it, because those are taken on mousedown with the default
          // prevented.
          setOpen(false)
          setQuery('')
          onBlur?.()
        }}
        onKeyDown={handleKeyDown}
      />

      {open && matches.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {matches.map((option, index) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                // Mouse down rather than click: the input's blur would
                // otherwise close the list before the click landed.
                onMouseDown={(event) => {
                  event.preventDefault()
                  pick(option)
                }}
                onMouseEnter={() => {
                  setActive(index)
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm ${
                  index === active ? 'bg-stone-100' : 'bg-white'
                }`}
              >
                {option.image ? (
                  <img src={option.image} alt="" className="h-4 w-6 shrink-0 rounded-sm object-cover" />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-navy-900">{option.label}</span>
                  {option.hint ? (
                    <span className="block truncate text-xs text-stone-500">{option.hint}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
