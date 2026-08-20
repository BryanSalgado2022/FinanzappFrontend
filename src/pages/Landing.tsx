import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Landmark, MessageCircle, Moon, Sun, Wallet } from 'lucide-react'
import { AnnualTrendChart } from '../components/AnnualTrendChart'
import { ProgressRing } from '../components/ProgressRing'
import { useTheme } from '../hooks/useTheme'
import { formatCOP } from '../lib/format'
import type { AnnualTrend } from '../types'
import wordmarkDark from '../assets/tobe-wordmark-dark.png'
import wordmarkLight from '../assets/tobe-wordmark-light.png'

// Illustrative only - never fetched, just gives the hero mockup a real chart
// with a believable shape instead of an empty/fake-looking placeholder.
const PREVIEW_TREND: AnnualTrend = {
  anio: new Date().getFullYear(),
  meses: [
    { mes: 1, total_ingresos: '3200000', total_gastos: '2950000' },
    { mes: 2, total_ingresos: '3200000', total_gastos: '2870000' },
    { mes: 3, total_ingresos: '3200000', total_gastos: '3040000' },
    { mes: 4, total_ingresos: '3350000', total_gastos: '2760000' },
    { mes: 5, total_ingresos: '3350000', total_gastos: '2690000' },
    { mes: 6, total_ingresos: '3350000', total_gastos: '2580000' },
    { mes: 7, total_ingresos: '3350000', total_gastos: '2510000' },
    { mes: 8, total_ingresos: '3500000', total_gastos: '2430000' },
    { mes: 9, total_ingresos: '3500000', total_gastos: '2360000' },
    { mes: 10, total_ingresos: '3500000', total_gastos: '2290000' },
    { mes: 11, total_ingresos: '3500000', total_gastos: '2220000' },
    { mes: 12, total_ingresos: '3650000', total_gastos: '2150000' },
  ],
}

const SPARK_BARS = [40, 55, 35, 70, 50, 85, 60, 95]

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}

const FEATURES = [
  {
    Icon: Wallet,
    title: 'Panorama mensual',
    description: 'Balance, ingresos y gastos del mes, con la tendencia del año completo de un vistazo.',
    visual: (
      <div className="flex h-8 items-end gap-1">
        {SPARK_BARS.map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-t-sm bg-accent/60"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    Icon: CalendarDays,
    title: 'Agenda de vencimientos',
    description: 'Todos tus pagos y fechas importantes en un calendario, para no volver a olvidar una cuota.',
    visual: (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === 9 || i === 16 ? 'bg-accent' : 'bg-line'
            }`}
          />
        ))}
      </div>
    ),
  },
  {
    Icon: Landmark,
    title: 'Deudas bajo control',
    description:
      'Registra tasa de interés y número de cuotas; TOBE calcula el plan de pago y el saldo restante por ti.',
    visual: (
      <div className="relative flex h-8 w-8 items-center justify-center">
        <ProgressRing percent={72} size={32} strokeWidth={4} />
        <span className="absolute font-tabular text-[10px] font-semibold text-ink">72%</span>
      </div>
    ),
  },
  {
    Icon: MessageCircle,
    title: 'Asistente con IA',
    description:
      'Escríbele en lenguaje natural — "gasté 50.000 en gasolina" — y confirmas la acción antes de guardarla.',
    visual: (
      <div className="flex flex-col items-end gap-1">
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-ink">Gasté 50.000</span>
        <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] text-ink-muted">✓ Registrado</span>
      </div>
    ),
  },
]

export function Landing() {
  const { theme, toggleTheme } = useTheme()
  const balance = useCountUp(2450000)
  const debtPercent = useCountUp(68, 1600)

  return (
    <div className="relative min-h-svh overflow-hidden bg-paper">
      <style>{`
        @keyframes tobe-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tobe-reveal {
          opacity: 0;
          animation: tobe-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'repeating-linear-gradient(var(--line) 0 1px, transparent 1px 32px)',
        }}
      />
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
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
          </button>
          <Link
            to="/login"
            className="text-sm text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pt-12 pb-24 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p
              className="tobe-reveal font-display text-sm font-medium tracking-wide text-accent uppercase"
              style={{ animationDelay: '0ms' }}
            >
              Presupuesto personal
            </p>
            <h1
              className="tobe-reveal mt-3 font-display text-4xl font-medium text-ink sm:text-5xl"
              style={{ animationDelay: '80ms' }}
            >
              Tu plata, sin hojas de cálculo.
            </h1>
            <p
              className="tobe-reveal mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0"
              style={{ animationDelay: '160ms' }}
            >
              TOBE es la forma más simple de ver tus deudas, pagos fijos e ingresos en un solo lugar —
              con un asistente que registra todo por ti, solo con escribirlo.
            </p>

            <Link
              to="/login"
              className="tobe-reveal mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:opacity-90"
              style={{ animationDelay: '240ms' }}
            >
              Comenzar
            </Link>
          </div>

          <div
            className="tobe-reveal relative mx-auto w-full max-w-sm transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg]"
            style={{ animationDelay: '200ms' }}
          >
            <div className="absolute -top-5 -right-5 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-paper-raised shadow-lg">
              <ProgressRing percent={debtPercent} size={48} strokeWidth={5} />
              <span className="absolute font-tabular text-xs font-semibold text-ink">{debtPercent}%</span>
            </div>

            <div className="rounded-3xl border border-line bg-paper-raised p-6 shadow-2xl">
              <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Balance del mes</p>
              <p className="font-tabular mt-1 font-display text-3xl font-semibold text-accent">
                {formatCOP(balance)}
              </p>
              <div className="mt-4 flex gap-6 border-t border-ink/10 pt-4">
                <div>
                  <p className="text-xs text-ink-muted">Ingresos</p>
                  <p className="font-tabular text-sm font-semibold text-ink">{formatCOP(3650000)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Gastos</p>
                  <p className="font-tabular text-sm font-semibold text-ink">{formatCOP(2150000)}</p>
                </div>
              </div>
              <div className="mt-4">
                <AnnualTrendChart trend={PREVIEW_TREND} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ Icon, title, description, visual }, i) => (
            <div
              key={title}
              className="tobe-reveal rounded-2xl border border-line bg-paper-raised p-5"
              style={{ animationDelay: `${280 + i * 90}ms` }}
            >
              <div className="flex items-start justify-between">
                <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
                {visual}
              </div>
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
