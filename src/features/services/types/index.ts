/*
 * The marks the website can draw for a service, mirroring the backend's
 * ServiceIconChoices. A free-text key looked more flexible and was not:
 * whoever filled it in had no way to know which words the site recognises, and
 * an unknown one fell back to a generic ticket without saying so.
 */
export const SERVICE_ICONS = [
  { value: 'car', label: 'Car' },
  { value: 'transfer', label: 'Airport shuttle' },
  { value: 'licence', label: 'Driving licence' },
  { value: 'shield', label: 'Shield (insurance)' },
  { value: 'sim', label: 'SIM card' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'passport', label: 'Passport' },
  { value: 'headset', label: 'Headset (support)' },
  { value: 'plane', label: 'Aeroplane' },
  { value: 'bed', label: 'Bed (hotel)' },
  { value: 'ship', label: 'Ship (cruise)' },
  { value: 'globe', label: 'Globe' },
  { value: 'bag', label: 'Luggage' },
  { value: 'map', label: 'Map' },
  { value: 'pin', label: 'Map pin' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'clock', label: 'Clock' },
  { value: 'users', label: 'People' },
  { value: 'meal', label: 'Meal' },
  { value: 'tag', label: 'Price tag' },
  { value: 'gift', label: 'Gift' },
  { value: 'book', label: 'Book (study)' },
  { value: 'mosque', label: 'Mosque (Umrah)' },
] as const

export type ServiceIcon = (typeof SERVICE_ICONS)[number]['value']

export interface Service {
  id: number
  name_ar: string
  name_en: string
  slug: string
  description_ar: string
  description_en: string
  /** One of SERVICE_ICONS, or '' for the site's default mark. */
  icon: string
  image: string | null
  /** Where the tile leads, as a path on the site. Empty sends the reader to
   *  the contact form. */
  link: string
  /** Which bucket an enquiry for this service is filed under — the column the
   *  Inquiries screen filters by. Empty leaves the form on its own default. */
  service_type: string
  /** Offered on the contact form as a choice of its own, so someone who came
   *  for this picks it by name instead of "Other". */
  is_on_contact_form: boolean
  order: number
  is_active: boolean
}

export type ServiceWrite = Omit<Service, 'id' | 'slug'>
