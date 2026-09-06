/*
 * Regenerates src/constants/countries.ts.
 *
 *   node scripts/generate-countries.mjs
 *
 * Names come from CLDR through Intl.DisplayNames, so nobody has to hand-type
 * 236 countries in two languages and nobody has to check the spelling. Run it
 * on a Node with full ICU (the default since Node 14).
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'constants', 'countries.ts')

// Deprecated or duplicate CLDR codes: East Germany, the Soviet Union, Zaire,
// "UK" beside GB. Offering them would put the same country in the list twice.
const RETIRED = new Set([
  'AN', 'BU', 'CS', 'CQ', 'DD', 'DY', 'FX', 'HV', 'NH', 'RH', 'SU', 'TP', 'UK',
  'VD', 'YD', 'YU', 'ZR',
])

// Not countries: unions, "unknown region", uninhabited territories and the
// dependencies that book through their parent country anyway.
const NOT_A_MARKET = new Set([
  'EU', 'EZ', 'UN', 'QO', 'ZZ', 'XA', 'XB', 'CP', 'DG', 'IC', 'EA', 'AC', 'TA',
  'BV', 'HM', 'AQ', 'GS', 'UM', 'SJ', 'PN', 'TF', 'EH', 'BQ', 'IO',
])

// Absent from the website's own dial-code table, which does carry Syria, Iraq,
// Yemen, Libya and Sudan — so that table is not one that shies away from
// difficult places. Left out here so the panel and the website offer the same
// countries. Delete a line to offer one.
const OMITTED_BY_THE_SITE = new Set(['IL', 'IR', 'KP'])

// Where the shipped airport catalogue already names a country, its spelling
// wins over CLDR's. CLDR says "المملكة العربية السعودية" where the catalogue says
// "السعودية"; picking the formal name in the panel would split one country's
// airports into two groups on the website.
const HOUSE_STYLE = {
  SA: { name_en: 'Saudi Arabia', name_ar: 'السعودية' },
  AE: { name_en: 'United Arab Emirates', name_ar: 'الإمارات' },
  HU: { name_en: 'Hungary', name_ar: 'المجر' },
  DK: { name_en: 'Denmark', name_ar: 'الدنمارك' },
  BA: { name_en: 'Bosnia and Herzegovina', name_ar: 'البوسنة والهرسك' },
  MV: { name_en: 'Maldives', name_ar: 'المالديف' },
  HK: { name_en: 'Hong Kong', name_ar: 'هونغ كونغ' },
}

const en = new Intl.DisplayNames(['en'], { type: 'region' })
const ar = new Intl.DisplayNames(['ar'], { type: 'region' })

const codes = []
for (let first = 65; first <= 90; first += 1) {
  for (let second = 65; second <= 90; second += 1) {
    const code = String.fromCharCode(first) + String.fromCharCode(second)
    // A code CLDR does not know comes back as itself.
    if (en.of(code) === code) continue
    if (RETIRED.has(code) || NOT_A_MARKET.has(code) || OMITTED_BY_THE_SITE.has(code)) continue
    codes.push(code)
  }
}
codes.sort()

const rows = codes.map((iso2) => ({
  iso2,
  name_en: HOUSE_STYLE[iso2]?.name_en ?? en.of(iso2),
  name_ar: HOUSE_STYLE[iso2]?.name_ar ?? ar.of(iso2),
}))

const file = `/*
 * Every country the panel can offer in a picker: ISO 3166-1 as CLDR knows it,
 * minus retired codes, uninhabited territories, and the three the website's own
 * dial-code table leaves out.
 *
 * Generated — do not edit by hand. Run \`node scripts/generate-countries.mjs\`,
 * which is also where the exclusions and the house spellings are explained.
 * Committed rather than computed at build time, so the panel's data does not
 * depend on whichever ICU the build machine happens to ship.
 */

export interface Country {
  /** ISO 3166-1 alpha-2. Also drives the flag image. */
  iso2: string
  name_en: string
  name_ar: string
}

/** Offered first: home, the Gulf, then where travellers here actually go. */
export const PREFERRED_ISO2 = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO', 'TR', 'GB', 'US', 'FR']

export const COUNTRIES: Country[] = [
${rows.map((r) => `  { iso2: '${r.iso2}', name_en: '${r.name_en.replace(/'/g, "\\'")}', name_ar: '${r.name_ar}' },`).join('\n')}
]

/** flagcdn serves one flag per ISO code. Used for the picker rows, and to fill
 *  in a visa country's flag when nobody has set one by hand. */
export function flagUrl(iso2: string, width = 40): string {
  return \`https://flagcdn.com/w\${width}/\${iso2.toLowerCase()}.png\`
}
`

writeFileSync(OUT, file)
console.log(`wrote ${rows.length} countries to ${OUT}`)
