/** The single announcement strip pinned across the top of every page on the
 *  site. Never a list — there is exactly one row, always fetched and saved
 *  at a fixed path rather than by id. */
export interface PromoBar {
  headline_ar: string
  headline_en: string
  /** Shown in a chip of its own. Blank hides the chip entirely — not every
   *  offer needs a code to quote. */
  code: string
  cta_label_ar: string
  cta_label_en: string
  /** A path on the site. Blank falls back to the contact form. */
  link: string
  is_active: boolean
  updated_at: string
}

export type PromoBarWrite = Omit<PromoBar, 'updated_at'>
