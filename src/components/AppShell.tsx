import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AgentChatWidget } from './AgentChatWidget'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const COLLAPSED_KEY = 'finanzapp.sidebarCollapsed'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, String(collapsed))
    } catch {
      // Ignore - collapsed preference just won't persist this session.
    }
  }, [collapsed])

  return (
    <div className="min-h-svh bg-paper">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div
        className={`transition-[margin] duration-200 ease-in-out ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}
      >
        <Header onOpenMobileSidebar={() => setMobileOpen(true)} />
        <Outlet />
      </div>
      <AgentChatWidget />
    </div>
  )
}
