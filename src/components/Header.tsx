import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Menu, Moon, Palette, Sparkles, Sun } from 'lucide-react'
import { AccentColorPicker } from './AccentColorPicker'
import { ChangelogPanel } from './ChangelogPanel'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { useChangelogSeen } from '../hooks/useChangelogSeen'
import wordmarkDark from '../assets/tobe-wordmark-dark.png'
import wordmarkLight from '../assets/tobe-wordmark-light.png'

export function Header({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [changelogOpen, setChangelogOpen] = useState(false)
  const { hasUnseen, markSeen } = useChangelogSeen()

  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Abrir menú"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink md:hidden"
        >
          <Menu className="h-4 w-4" strokeWidth={2} />
        </button>
        <Link to="/dashboard" aria-label="TOBE" className="flex items-center">
          <img
            src={theme === 'dark' ? wordmarkDark : wordmarkLight}
            alt="TOBE"
            className="h-6 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && <span className="hidden text-sm text-ink-muted md:inline">{user.name}</span>}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setChangelogOpen((v) => !v)
              markSeen()
            }}
            aria-label="Novedades"
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            {hasUnseen && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            )}
          </button>
          <ChangelogPanel open={changelogOpen} onClose={() => setChangelogOpen(false)} />
        </div>
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
    </header>
  )
}
