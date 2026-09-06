import type { Role } from '@/types'
import { ADMIN_ROLES, ALL_ROLES } from './roles'

export interface NavItem {
  label: string
  path: string
  /** Roles that see this entry in the sidebar. Backend still enforces the real authorization. */
  roles: Role[]
}

/**
 * Single source of truth for the sidebar. Adding a module to "dozens" later is one entry here
 * plus a route registration — nothing else about the shell changes.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', roles: ALL_ROLES },
  { label: 'Inquiries', path: '/inquiries', roles: ALL_ROLES },
  { label: 'Contact form questions', path: '/contact-fields', roles: ALL_ROLES },
  { label: 'Destinations', path: '/destinations', roles: ALL_ROLES },
  { label: 'Packages', path: '/packages', roles: ALL_ROLES },
  { label: 'Visas', path: '/visas', roles: ALL_ROLES },
  { label: 'Visa countries', path: '/visa-countries', roles: ALL_ROLES },
  { label: 'Services', path: '/services', roles: ALL_ROLES },
  { label: 'Flights', path: '/flights', roles: ALL_ROLES },
  { label: 'Airports', path: '/airports', roles: ALL_ROLES },
  { label: 'Hotels', path: '/hotels', roles: ALL_ROLES },
  { label: 'Cruises', path: '/cruises', roles: ALL_ROLES },
  { label: 'Cruise ports', path: '/cruise-ports', roles: ALL_ROLES },
  { label: 'Offers', path: '/offers', roles: ALL_ROLES },
  { label: 'Bookings', path: '/bookings', roles: ALL_ROLES },
  { label: 'Testimonials', path: '/testimonials', roles: ALL_ROLES },
  { label: 'Partners', path: '/partners', roles: ALL_ROLES },
  { label: 'Navigation', path: '/navigation', roles: ALL_ROLES },
  { label: 'Certificates', path: '/certificates', roles: ALL_ROLES },
  { label: 'Branches', path: '/branches', roles: ALL_ROLES },
  { label: 'Promotions', path: '/promotions', roles: ALL_ROLES },
  { label: 'Social links', path: '/social-links', roles: ALL_ROLES },
  { label: 'Homepage sections', path: '/home-sections', roles: ALL_ROLES },
  { label: 'Page heroes', path: '/pages', roles: ALL_ROLES },
  { label: 'Media library', path: '/media', roles: ALL_ROLES },
  { label: 'Users', path: '/users', roles: ADMIN_ROLES },
]
