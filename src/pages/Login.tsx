import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

export function Login() {
  const { signInWithGoogleCredential, signInError } = useAuth()
  const { theme } = useTheme()

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
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-2xl">
          🌿
        </span>

        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Finanzapp</h1>
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

        {signInError && <p className="mt-4 text-sm text-danger">{signInError}</p>}
      </div>

      <p className="relative mt-16 text-xs text-ink-muted">Deudas, gastos fijos e ingresos — en un solo lugar.</p>
    </div>
  )
}
