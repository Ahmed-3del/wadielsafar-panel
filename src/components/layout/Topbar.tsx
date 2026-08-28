import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/authentication'

export function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    void logout().then(() => {
      void navigate('/login', { replace: true })
    })
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-6">
      <p className="text-sm text-stone-500">
        {import.meta.env.VITE_APP_NAME}
      </p>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-stone-600">
            {user.email} <span className="text-stone-400">· {user.role}</span>
          </span>
        )}
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  )
}
