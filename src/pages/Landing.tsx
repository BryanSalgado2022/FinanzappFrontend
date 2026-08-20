import { Link } from 'react-router-dom'
import { CalendarDays, Landmark, MessageCircle, Wallet } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import wordmarkDark from '../assets/tobe-wordmark-dark.png'
import wordmarkLight from '../assets/tobe-wordmark-light.png'

const FEATURES = [
  {
    Icon: Wallet,
    title: 'Panorama mensual',
    description: 'Balance, ingresos y gastos del mes, con la tendencia del año completo de un vistazo.',
  },
  {
    Icon: CalendarDays,
    title: 'Agenda de vencimientos',
    description: 'Todos tus pagos y fechas importantes en un calendario, para no volver a olvidar una cuota.',
  },
  {
    Icon: Landmark,
    title: 'Deudas bajo control',
    description:
      'Registra tasa de interés y número de cuotas; TOBE calcula el plan de pago y el saldo restante por ti.',
  },
  {
    Icon: MessageCircle,
    title: 'Asistente con IA',
    description:
      'Escríbele en lenguaje natural — "gasté 50.000 en gasolina" — y confirmas la acción antes de guardarla.',
  },
]

export function Landing() {
  const { theme } = useTheme()

  return (
    <div className="relative min-h-svh overflow-hidden bg-paper">
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

      <header className="relative flex items-center justify-between px-6 py-6 sm:px-10">
        <img src={theme === 'dark' ? wordmarkDark : wordmarkLight} alt="TOBE" className="h-8 w-auto" />
        <Link
          to="/login"
          className="text-sm text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          Iniciar sesión
        </Link>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 pt-16 pb-24 text-center sm:px-10">
        <h1 className="font-display text-4xl font-medium text-ink sm:text-5xl">
          Tu plata, sin hojas de cálculo.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
          TOBE es la forma más simple de ver tus deudas, pagos fijos e ingresos en un solo lugar — con un
          asistente que registra todo por ti, solo con escribirlo.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:opacity-90"
        >
          Comenzar
        </Link>

        <div className="mt-20 grid gap-5 text-left sm:grid-cols-2">
          {FEATURES.map(({ Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-line bg-paper-raised p-5">
              <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
              <h2 className="mt-3 font-display text-base font-medium text-ink">{title}</h2>
              <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
            </div>
          ))}
        </div>
      </main>

      <p className="relative pb-10 text-center text-xs text-ink-muted">
        Deudas, gastos fijos e ingresos — en un solo lugar.
      </p>
    </div>
  )
}
