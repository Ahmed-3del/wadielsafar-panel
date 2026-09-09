import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/authentication'

interface TopbarProps {
  /** Opens the mobile nav drawer. The button that calls it is hidden from lg
   *  up, where the sidebar needs no toggle at all. */
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    void logout().then(() => {
      void navigate('/login', { replace: true })
    })
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          // The only way into navigation below lg, now that the rail beside
          // this is gone rather than merely cramped.
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-lg text-stone-500 hover:bg-stone-100 lg:hidden"
        >
          {/* A character, not an icon component — this codebase draws its few
              glyphs (the reorder arrows on Homepage sections) the same way
              rather than carrying an icon library for a handful of uses. */}
          <span aria-hidden="true">☰</span>
        </button>
        <p className="truncate text-sm text-stone-500">{import.meta.env.VITE_APP_NAME}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {user && (
          // Hidden below sm rather than left to wrap: at 240px of rail gone
          // from beside it, the topbar has the phone's full width now and
          // this alone would still fit — but a signed-in admin already sees
          // their own email in the corner on every larger screen, and a
          // phone has better uses for its one line than repeating it.
          <span className="hidden text-sm text-stone-600 sm:inline">
            {user.email} <span className="text-stone-400">· {user.role}</span>
          </span>
        )}
        <Button variant="secondary" onClick={handleLogout} className="shrink-0 whitespace-nowrap">
          Log out
        </Button>
      </div>
    </header>
  )
}
