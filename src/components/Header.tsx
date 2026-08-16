import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-4">
      <span className="font-display text-xl font-semibold tracking-tight text-ink">Finanzapp</span>
      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden text-sm text-ink-muted sm:inline">{user.name}</span>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          type="button"
          onClick={signOut}
          className="text-sm text-ink-muted underline decoration-line underline-offset-4 transition hover:text-ink"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
