import { z } from 'zod'

/*
 * Blank or a number in range. Blank is a real answer — a branch whose pin
 * nobody has looked up yet — so it must not be an error.
 */
const coordinate = (limit: number, message: string) =>
  z.string().refine((value) => {
    const trimmed = value.trim()
    if (trimmed === '') return true
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) && Math.abs(parsed) <= limit
  }, message)

export const branchSchema = z
  .object({
    name_ar: z.string().min(1, 'Arabic name is required'),
    name_en: z.string().min(1, 'English name is required'),
    // Matches the backend's validator, so the message arrives before the round
    // trip does.
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{6,14}$/, 'International format with no spaces, e.g. +966115602558'),
    phone_display: z.string(),
    address_ar: z.string(),
    address_en: z.string(),
    working_hours_ar: z.string(),
    working_hours_en: z.string(),
    latitude: coordinate(90, 'Latitude must be between -90 and 90, or left blank'),
    longitude: coordinate(180, 'Longitude must be between -180 and 180, or left blank'),
    google_maps_url: z
      .string()
      .refine((value) => value === '' || value.startsWith('https://'), 'Paste a full https:// link'),
    is_main: z.boolean(),
    order: z.number().int().min(0),
    is_active: z.boolean(),
  })
  // One coordinate on its own places nothing. The site needs the pair or
  // neither, so the half-filled case is caught here rather than silently
  // dropping the map.
  .refine(
    (values) => (values.latitude.trim() === '') === (values.longitude.trim() === ''),
    { path: ['longitude'], message: 'Give both coordinates, or neither' },
  )

export type BranchFormValues = z.infer<typeof branchSchema>
