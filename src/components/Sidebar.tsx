import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  CheckSquare,
  HandCoins,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Tag,
  Wallet,
} from 'lucide-react'

const LINKS = [
  { to: '/dashboard', end: true, label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/agenda', end: false, label: 'Agenda', Icon: CalendarDays },
  { to: '/deudas', end: false, label: 'Deudas', Icon: Wallet },
  { to: '/categorias', end: false, label: 'Categorías', Icon: Tag },
  { to: '/tareas', end: false, label: 'Tareas', Icon: CheckSquare },
  { to: '/deudores', end: false, label: 'Deudores', Icon: HandCoins },
  { to: '/gastos', end: false, label: 'Gastos', Icon: Receipt },
] as const

interface SidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function Sidebar({ mobileOpen, onCloseMobile, collapsed, onToggleCollapsed }: SidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseMobile()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen, onCloseMobile])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      collapsed ? 'md:justify-center' : ''
    } ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-paper hover:text-ink'}`

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-ink/50 backdrop-blur-sm transition-opacity duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
      />
      <nav
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 left-0 z-20 w-64 space-y-1 overflow-hidden border-r border-line bg-paper-raised p-4 shadow-xl transition-transform duration-200 ease-in-out md:translate-x-0 md:shadow-none md:transition-[width] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        <div className={`mb-2 hidden items-center md:flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-paper hover:text-ink"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" strokeWidth={2} />
            ) : (
              <PanelLeftClose className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {LINKS.map(({ to, end, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={linkClass}
            aria-label={label}
            title={label}
            onClick={onCloseMobile}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className={collapsed ? 'md:hidden' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
