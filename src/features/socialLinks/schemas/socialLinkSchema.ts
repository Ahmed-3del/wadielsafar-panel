import { z } from 'zod'
import { SOCIAL_PLATFORMS } from '../types'

export const socialLinkSchema = z.object({
  // The platform picks the icon the website draws, so it is chosen rather than
  // guessed from the URL.
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.string().url('Enter the full profile URL'),
  order: z.number().int().min(0),
  is_active: z.boolean(),
})

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>
