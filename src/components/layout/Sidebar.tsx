import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { useAuth } from '@/features/authentication'

interface SidebarProps {
  /** Whether the mobile drawer is open. Ignored from lg up, where the rail is
   *  always visible and this prop has nothing to control. */
  isOpen: boolean
  onClose: () => void
}

/*
 * The nav rail — always visible from lg up, an off-canvas drawer below it.
 *
 * There was no responsive behaviour here at all before this: a fixed 240px
 * rail sat beside the content on every screen, which on a 390px phone left
 * about 150px for the page itself — a "New Promotion" button read as "New
 * Promotio…" and the topbar's email wrapped across three lines fighting it
 * for space. Below lg the rail is hidden entirely now, and this is the only
 * way to reach it.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()
  const items = NAV_ITEMS.filter((item) => (user ? item.roles.includes(user.role) : false))

  // Rendered twice — once into the static desktop rail, once into the mobile
  // drawer — rather than one aside toggled by a class, so the drawer can be
  // absent from the DOM (and its backdrop un-clickable) until it is opened.
  const content = (
    <>
      <div className="px-5 py-5">
        {/* The lockup as drawn, not typed out in a system face. It is wider
            than it is tall, so the caption goes underneath rather than beside
            it — side by side, a 240px rail leaves the words unreadable. */}
        <img src="/logo-horizontal.png" alt="Wadi Al Safar" className="h-12 w-auto" />
        <p className="mt-2 text-xs text-stone-500">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            // Closing on navigate matters only on mobile — closing an
            // already-static desktop rail is a no-op — so one handler
            // covers both without checking which mode is active.
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-navy-50 text-navy-800' : 'text-stone-600 hover:bg-stone-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  )

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Covers the page and closes the drawer; the drawer itself sits on
              top and stops the click before it reaches this. */}
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy-950/50"
            onClick={onClose}
          />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
