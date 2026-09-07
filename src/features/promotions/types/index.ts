export const PROMOTION_ICONS = ['TAG', 'CLOCK', 'GIFT'] as const

export type PromotionIcon = (typeof PROMOTION_ICONS)[number]

export interface Promotion {
  id: number
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  /** The figure the card leads with — "15%", "SAR 200". Free text, because a
   *  saving is not always a percentage. */
  badge_ar: string
  badge_en: string
  /** A code for the customer to quote. Blank when the offer needs none. */
  code: string
  /** ISO instant. Null means no announced end, and the card shows no timer. */
  ends_at: string | null
  icon: PromotionIcon
  /** Where "claim this offer" leads, as a path on the site. Empty sends the
   *  reader to the contact form carrying the code. */
  link: string
  /** Overrides the button's wording. Empty uses the website's own. */
  cta_label_ar: string
  cta_label_en: string
  order: number
  is_active: boolean
}

export type PromotionWrite = Omit<Promotion, 'id'>
