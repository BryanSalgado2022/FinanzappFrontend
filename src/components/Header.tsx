import { Link, NavLink } from 'react-router-dom'
import { CheckSquare, LayoutDashboard, Leaf, LogOut, Moon, Sun, Tag, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:text-ink'
  }`

export function Header() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
        >
          <Leaf className="h-5 w-5 text-accent" strokeWidth={2} />
          <span className="hidden sm:inline">Finanzapp</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass} aria-label="Dashboard">
            <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Dashboard</span>
          </NavLink>
          <NavLink to="/deudas" className={navLinkClass} aria-label="Deudas">
            <Wallet className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Deudas</span>
          </NavLink>
          <NavLink to="/categorias" className={navLinkClass} aria-label="Categorías">
            <Tag className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Categorías</span>
          </NavLink>
          <NavLink to="/tareas" className={navLinkClass} aria-label="Tareas">
            <CheckSquare className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Tareas</span>
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user && <span className="hidden text-sm text-ink-muted md:inline">{user.name}</span>}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          onClick={signOut}
          aria-label="Cerrar sesión"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-muted transition hover:bg-danger-soft hover:text-danger"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  )
}
