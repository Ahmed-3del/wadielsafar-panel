export const SOCIAL_PLATFORMS = [
  'FACEBOOK',
  'INSTAGRAM',
  'X',
  'TIKTOK',
  'SNAPCHAT',
  'YOUTUBE',
  'LINKEDIN',
  'WHATSAPP',
] as const

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export interface SocialLink {
  id: number
  platform: SocialPlatform
  url: string
  order: number
  is_active: boolean
}

export type SocialLinkWrite = Omit<SocialLink, 'id'>
