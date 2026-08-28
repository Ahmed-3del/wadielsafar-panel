import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <Outlet />
    </div>
  )
}
