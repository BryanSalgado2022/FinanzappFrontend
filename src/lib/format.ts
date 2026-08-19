import type { TipoConcepto } from '../types'

const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatCOP(value: string | number): string {
  return cop.format(Number(value))
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const MONTH_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

export function monthName(mes: number): string {
  return MONTH_NAMES[mes - 1] ?? String(mes)
}

export function monthShort(mes: number): string {
  return MONTH_SHORT[mes - 1] ?? String(mes)
}

export function quarterLabel(quarter: 1 | 2 | 3 | 4): string {
  const startMonth = (quarter - 1) * 3 + 1
  return `T${quarter} · ${monthShort(startMonth)}–${monthShort(startMonth + 2)}`
}

// "gasto_fijo" displays as "Pago mensual" - the internal identifier is
// unchanged (still `gasto_fijo` in the API), this is a label-only rename to
// avoid colliding with "Gasto puntual" (the separate Gasto entity) in the
// unified creation menu.
const TIPO_LABELS: Record<string, string> = {
  deuda: 'Deuda',
  gasto_fijo: 'Pago mensual',
  ingreso: 'Ingreso',
}

export function tipoLabel(tipo: string): string {
  return TIPO_LABELS[tipo] ?? tipo
}

const TIPO_DOT_CLASSES: Record<string, string> = {
  deuda: 'bg-danger',
  gasto_fijo: 'bg-warn',
  ingreso: 'bg-accent',
}

export function tipoDotClass(tipo: string): string {
  return TIPO_DOT_CLASSES[tipo] ?? 'bg-ink-muted'
}

// Parses "YYYY-MM-DD" by hand rather than `new Date(fecha)` - the latter
// parses as UTC midnight, which can display as the previous day in a
// negative-UTC-offset timezone (like Colombia).
export function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-').map(Number)
  return `${day} ${monthShort(month)} ${year}`
}

export function formatHora(hora: string): string {
  const [h, m] = hora.split(':')
  return `${h}:${m}`
}

// An `ingreso` doesn't "vencer" (become due) - it's received. Centralizes
// the two label variants so ConceptDetail, NewConceptForm, and the Agenda's
// event rendering never duplicate this tipo-check on their own.
export function diaVencimientoLabel(tipo: TipoConcepto): {
  field: string
  display: (dia: number) => string
} {
  if (tipo === 'ingreso') {
    return { field: 'Día de pago', display: (dia) => `Te pagan el día ${dia}` }
  }
  return { field: 'Día de vencimiento', display: (dia) => `Vence el día ${dia}` }
}
