import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { useAuth } from '@/features/authentication'

export function Sidebar() {
  const { user } = useAuth()
  const items = NAV_ITEMS.filter((item) => (user ? item.roles.includes(user.role) : false))

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white">
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
    </aside>
  )
}
