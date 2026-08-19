import { useState, type FormEvent } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import wordmarkDark from '../assets/tobe-wordmark-dark.png'
import wordmarkLight from '../assets/tobe-wordmark-light.png'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function Login() {
  const { signInWithGoogleCredential, signInAsDevUser, signInWithPassword, registerWithPassword, signInError } =
    useAuth()
  const { theme } = useTheme()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setClientError(null)

    if (mode === 'register' && password.length < 8) {
      setClientError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setSubmitting(true)
    if (mode === 'login') {
      await signInWithPassword(email, password)
    } else {
      await registerWithPassword(nombre, email, password)
    }
    setSubmitting(false)
  }

  const toggleMode = () => {
    setClientError(null)
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }

  const errorToShow = clientError ?? signInError

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-paper px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--warn) 0%, transparent 70%)' }}
      />

      <div className="relative flex w-full max-w-xs flex-col items-center text-center">
        <img
          src={theme === 'dark' ? wordmarkDark : wordmarkLight}
          alt="TOBE"
          className="mb-6 h-10 w-auto"
        />
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
          Tu presupuesto, llevado con calma.
          <br />
          Sin la hoja de cálculo.
        </p>

        <div className="mt-10">
          <GoogleLogin
            theme={theme === 'dark' ? 'filled_black' : 'outline'}
            shape="pill"
            size="large"
            onSuccess={(response) => {
              if (response.credential) {
                void signInWithGoogleCredential(response.credential)
              }
            }}
            onError={() => {
              /* @react-oauth/google logs its own console error; sign-in simply stays pending */
            }}
          />
        </div>

        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={() => void signInAsDevUser()}
            className="mt-4 text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
          >
            Entrar como invitado (solo desarrollo)
          </button>
        )}

        <div className="mt-8 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-muted">o</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3 text-left">
          {mode === 'register' && (
            <input
              required
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
            />
          )}
          <input
            required
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            required
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? mode === 'login'
                ? 'Entrando…'
                : 'Creando cuenta…'
              : mode === 'login'
                ? 'Entrar'
                : 'Crear cuenta'}
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-4 text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>

        {errorToShow && <p className="mt-4 text-sm text-danger">{errorToShow}</p>}
      </div>

      <p className="relative mt-16 text-xs text-ink-muted">Deudas, gastos fijos e ingresos — en un solo lugar.</p>
    </div>
  )
}
