export type HeroMediaType = 'NONE' | 'IMAGE' | 'VIDEO'

// "home" backs the search band at the top of the homepage — only its
// background is used there (image, video, gradient); the copy fields are
// ignored, since that band keeps its own translated heading.
export const PAGE_KEYS = [
  'home',
  'destinations',
  'packages',
  'visas',
  'flights',
  'hotels',
  'cruises',
  'offers',
  'corporate',
  'about',
  'contact',
] as const

export type PageKey = (typeof PAGE_KEYS)[number]

export const HERO_MEDIA_TYPES: { value: HeroMediaType; label: string }[] = [
  { value: 'NONE', label: 'Brand gradient (no media)' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'VIDEO', label: 'Video' },
]

export interface PageHero {
  id: number
  page_key: PageKey
  media_type: HeroMediaType
  image_url: string
  video_url: string
  poster_url: string
  overlay_opacity: number
  eyebrow_ar: string
  eyebrow_en: string
  title_ar: string
  title_en: string
  subtitle_ar: string
  subtitle_en: string
  is_active: boolean
}

export type PageHeroWrite = Omit<PageHero, 'id'>
