export type NavGroup = 'PRIMARY' | 'SECONDARY'

export const NAV_GROUPS: { value: NavGroup; label: string }[] = [
  { value: 'PRIMARY', label: 'Header and mobile menu' },
  { value: 'SECONDARY', label: 'Footer only' },
]

export interface NavItem {
  id: number
  label_ar: string
  label_en: string
  href: string
  group: NavGroup
  order: number
  is_active: boolean
}

export type NavItemWrite = Omit<NavItem, 'id'>
