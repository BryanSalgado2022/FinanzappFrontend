import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, LogOut, Menu, Moon, Palette, Sun } from 'lucide-react'
import { AccentColorPicker } from './AccentColorPicker'
import { Sidebar } from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
        >
          <Menu className="h-4 w-4" strokeWidth={2} />
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
        >
          <Leaf className="h-5 w-5 text-accent" strokeWidth={2} />
          <span className="hidden sm:inline">Finanzapp</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && <span className="hidden text-sm text-ink-muted md:inline">{user.name}</span>}
        <div className="relative">
          <button
            type="button"
            onClick={() => setColorPickerOpen((v) => !v)}
            aria-label="Elegir color de acento"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <Palette className="h-4 w-4" strokeWidth={2} />
          </button>
          <AccentColorPicker open={colorPickerOpen} onClose={() => setColorPickerOpen(false)} />
        </div>
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

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  )
}
