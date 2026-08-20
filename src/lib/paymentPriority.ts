import type { DashboardConceptRow } from '../hooks/useDashboardConcepts'
import { monthShort } from './format'

export type PriorityLevel = 'alta' | 'media' | 'baja'

export interface PriorityEntry {
  conceptoId: number
  nombre: string
  anio: number
  mes: number
  monto_planeado: string
  dueDate: Date
  level: PriorityLevel
}

const MEDIA_WINDOW_DAYS = 5

function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/** Ranks every pending deuda/gasto_fijo entry (across all months, not just
 * one) by how urgent its due date is - Alta (overdue) first, then Media
 * (due within MEDIA_WINDOW_DAYS days), then Baja, each tier sorted by
 * soonest due date. Ingresos and entries with no dia_vencimiento never
 * qualify - there's no due date to prioritize by. */
export function computePaymentPriority(rows: DashboardConceptRow[], today: Date): PriorityEntry[] {
  const mediaCutoff = endOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + MEDIA_WINDOW_DAYS))

  const entries: PriorityEntry[] = []
  for (const { concepto, entries: conceptEntries } of rows) {
    if (concepto.tipo === 'ingreso' || concepto.dia_vencimiento === null) continue

    for (const entry of conceptEntries) {
      if (entry.pagado) continue

      const dueDate = new Date(entry.anio, entry.mes - 1, concepto.dia_vencimiento)
      const level: PriorityLevel = entry.vencida ? 'alta' : dueDate <= mediaCutoff ? 'media' : 'baja'

      entries.push({
        conceptoId: concepto.id,
        nombre: concepto.nombre,
        anio: entry.anio,
        mes: entry.mes,
        monto_planeado: entry.monto_planeado,
        dueDate,
        level,
      })
    }
  }

  return entries.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

/** "atrasado · 18 ago" for overdue entries; a relative "vence hoy"/"vence
 * mañana"/"vence en N días" for what's coming up soon; an absolute "vence
 * el 18 ago" for anything far enough out that a day-count stops being
 * useful. */
export function formatDueStatus(entry: PriorityEntry, today: Date): string {
  const dateLabel = `${entry.dueDate.getDate()} ${monthShort(entry.dueDate.getMonth() + 1)}`

  if (entry.level === 'alta') return `atrasado · ${dateLabel}`

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const daysUntil = Math.round((entry.dueDate.getTime() - startOfToday.getTime()) / 86_400_000)

  if (daysUntil === 0) return 'vence hoy'
  if (daysUntil === 1) return 'vence mañana'
  if (entry.level === 'media') return `vence en ${daysUntil} días`
  return `vence el ${dateLabel}`
}
