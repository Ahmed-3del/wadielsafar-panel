import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function DashboardLayout() {
  // Lives here, one level above both: Sidebar and Topbar are siblings, and
  // the button that opens the drawer is not inside the component it opens.
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => { setSidebarOpen(false) }} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => { setSidebarOpen(true) }} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
