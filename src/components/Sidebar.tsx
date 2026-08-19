import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { CalendarDays, CheckSquare, HandCoins, LayoutDashboard, Receipt, Tag, Wallet } from 'lucide-react'

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-paper hover:text-ink'
  }`

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-20 bg-ink/50 backdrop-blur-sm transition-opacity duration-200 ease-in-out ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    >
      <nav
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 left-0 w-64 space-y-1 border-r border-line bg-paper-raised p-4 shadow-xl transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavLink to="/" end className={sidebarLinkClass} aria-label="Dashboard" onClick={onClose}>
          <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
          Dashboard
        </NavLink>
        <NavLink to="/agenda" className={sidebarLinkClass} aria-label="Agenda" onClick={onClose}>
          <CalendarDays className="h-4 w-4" strokeWidth={2} />
          Agenda
        </NavLink>
        <NavLink to="/deudas" className={sidebarLinkClass} aria-label="Deudas" onClick={onClose}>
          <Wallet className="h-4 w-4" strokeWidth={2} />
          Deudas
        </NavLink>
        <NavLink to="/categorias" className={sidebarLinkClass} aria-label="Categorías" onClick={onClose}>
          <Tag className="h-4 w-4" strokeWidth={2} />
          Categorías
        </NavLink>
        <NavLink to="/tareas" className={sidebarLinkClass} aria-label="Tareas" onClick={onClose}>
          <CheckSquare className="h-4 w-4" strokeWidth={2} />
          Tareas
        </NavLink>
        <NavLink to="/deudores" className={sidebarLinkClass} aria-label="Deudores" onClick={onClose}>
          <HandCoins className="h-4 w-4" strokeWidth={2} />
          Deudores
        </NavLink>
        <NavLink to="/gastos" className={sidebarLinkClass} aria-label="Gastos" onClick={onClose}>
          <Receipt className="h-4 w-4" strokeWidth={2} />
          Gastos
        </NavLink>
      </nav>
    </div>
  )
}
