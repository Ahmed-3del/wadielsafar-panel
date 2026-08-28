import type { HotelAmenity } from '../types'

interface AmenityCheckboxGroupProps {
  amenities: HotelAmenity[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

/**
 * Checkbox group rather than `<select multiple>`: staff pick a handful of amenities from a
 * short list, and checkboxes need no ctrl-click discovery to be usable.
 */
export function AmenityCheckboxGroup({
  amenities,
  selectedIds,
  onToggle,
}: AmenityCheckboxGroupProps) {
  if (amenities.length === 0) {
    return <p className="text-sm text-stone-500">No amenities defined yet.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-2 rounded-md border border-stone-300 p-3 sm:grid-cols-3">
      {amenities.map((amenity) => {
        const id = String(amenity.id)
        return (
          <label key={amenity.id} className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-stone-300"
              value={id}
              checked={selectedIds.includes(id)}
              onChange={() => {
                onToggle(id)
              }}
            />
            {amenity.name_en}
          </label>
        )
      })}
    </div>
  )
}
