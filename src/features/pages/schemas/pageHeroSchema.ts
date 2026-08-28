import { z } from 'zod'
import { PAGE_KEYS } from '../types'

export const pageHeroSchema = z
  .object({
    page_key: z.enum(PAGE_KEYS),
    media_type: z.enum(['NONE', 'IMAGE', 'VIDEO']),
    image_url: z.string(),
    video_url: z.string(),
    poster_url: z.string(),
    overlay_opacity: z.number().int().min(0).max(100),
    eyebrow_ar: z.string(),
    eyebrow_en: z.string(),
    title_ar: z.string(),
    title_en: z.string(),
    subtitle_ar: z.string(),
    subtitle_en: z.string(),
    is_active: z.boolean(),
  })
  // Mirrors the server rule: a hero set to IMAGE or VIDEO with no source
  // renders as an empty band on the site, so it is caught before saving.
  .refine((v) => v.media_type !== 'IMAGE' || v.image_url.trim().length > 0, {
    path: ['image_url'],
    message: 'An image URL is required for an image hero.',
  })
  .refine((v) => v.media_type !== 'VIDEO' || v.video_url.trim().length > 0, {
    path: ['video_url'],
    message: 'A video URL is required for a video hero.',
  })

export type PageHeroFormValues = z.infer<typeof pageHeroSchema>
