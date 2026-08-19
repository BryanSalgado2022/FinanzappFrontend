import type { DashboardConceptRow } from '../hooks/useDashboardConcepts'
import type { Abono, Concepto, Deudor, EntradaMensual, Gasto, Tarea } from '../types'

// Two kinds beyond design.md's original five ("concepto_cierre",
// "deudor_cierre") - a manual close (finalizado_en) can land on a day with
// no due-day event at all, so it can't be folded into the "concepto"/"abono"
// events' `celebracion` field the way the zero-balance-payment celebration
// can; it needs its own event so it still shows up on its own day.
export type AgendaEvent =
  | { kind: 'concepto'; fecha: string; concepto: Concepto; entry: EntradaMensual; celebracion: 'pago' | null }
  | { kind: 'concepto_cierre'; fecha: string; concepto: Concepto }
  | { kind: 'gasto'; fecha: string; gasto: Gasto }
  | { kind: 'tarea'; fecha: string; tarea: Tarea }
  | { kind: 'deudor_inicio'; fecha: string; deudor: Deudor }
  | { kind: 'abono'; fecha: string; abono: Abono; deudor: Deudor; celebracion: 'pago' | null }
  | { kind: 'deudor_cierre'; fecha: string; deudor: Deudor }

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function enMes(fecha: string, anio: number, mes: number): boolean {
  const [y, m] = fecha.split('-').map(Number)
  return y === anio && m === mes
}

// Shared by both a debt's paid entries and a debtor's abonos: the most
// recently dated paid item, but only when the balance it's paying off is
// exactly zero - the same "find max, gate on zero" rule either way.
export function findCelebracionPago(fechas: (string | null)[], saldoRestante: number): string | null {
  if (saldoRestante !== 0) return null
  const pagadas = fechas.filter((f): f is string => f !== null)
  if (pagadas.length === 0) return null
  return pagadas.reduce((max, f) => (f > max ? f : max))
}

export function buildConceptoEvents(
  rows: DashboardConceptRow[],
  anio: number,
  mes: number,
): AgendaEvent[] {
  const events: AgendaEvent[] = []
  for (const { concepto, entry, entries } of rows) {
    const dueFecha =
      concepto.dia_vencimiento !== null
        ? `${anio}-${pad2(mes)}-${pad2(concepto.dia_vencimiento)}`
        : null

    let fechaPago: string | null = null
    if (concepto.tipo === 'deuda' && concepto.saldo_restante !== null) {
      fechaPago = findCelebracionPago(
        entries.filter((e) => e.pagado).map((e) => e.fecha_pago),
        Number(concepto.saldo_restante),
      )
    }

    if (entry && dueFecha !== null) {
      events.push({
        kind: 'concepto',
        fecha: dueFecha,
        concepto,
        entry,
        celebracion: fechaPago === dueFecha ? 'pago' : null,
      })
    }

    // The payoff can land on a different day than the recurring due day
    // (e.g. paid late, or the concept has no due day at all) - give it its
    // own marker there so the celebration isn't silently dropped.
    if (fechaPago && fechaPago !== dueFecha && enMes(fechaPago, anio, mes)) {
      const paidEntry = entries.find((e) => e.fecha_pago === fechaPago)
      if (paidEntry) {
        events.push({ kind: 'concepto', fecha: fechaPago, concepto, entry: paidEntry, celebracion: 'pago' })
      }
    }

    if (concepto.tipo === 'deuda' && concepto.finalizado_en && enMes(concepto.finalizado_en, anio, mes)) {
      events.push({ kind: 'concepto_cierre', fecha: concepto.finalizado_en, concepto })
    }
  }
  return events
}

export function buildDeudorEvents(
  deudores: Deudor[],
  abonosPorDeudor: Map<number, Abono[]>,
  anio: number,
  mes: number,
): AgendaEvent[] {
  const events: AgendaEvent[] = []
  for (const deudor of deudores) {
    if (enMes(deudor.fecha, anio, mes)) {
      events.push({ kind: 'deudor_inicio', fecha: deudor.fecha, deudor })
    }
    const abonos = abonosPorDeudor.get(deudor.id) ?? []
    const fechaCelebracion = findCelebracionPago(
      abonos.map((a) => a.fecha),
      Number(deudor.saldo_restante),
    )
    for (const abono of abonos) {
      if (!enMes(abono.fecha, anio, mes)) continue
      events.push({
        kind: 'abono',
        fecha: abono.fecha,
        abono,
        deudor,
        celebracion: abono.fecha === fechaCelebracion ? 'pago' : null,
      })
    }
    if (deudor.finalizado_en && enMes(deudor.finalizado_en, anio, mes)) {
      events.push({ kind: 'deudor_cierre', fecha: deudor.finalizado_en, deudor })
    }
  }
  return events
}

export function buildGastoEvents(gastos: Gasto[]): AgendaEvent[] {
  return gastos.map((gasto) => ({ kind: 'gasto', fecha: gasto.fecha, gasto }))
}

export function buildTareaEvents(tareas: Tarea[], anio: number, mes: number): AgendaEvent[] {
  return tareas
    .filter((t): t is Tarea & { fecha: string } => t.fecha !== null && enMes(t.fecha, anio, mes))
    .map((tarea) => ({ kind: 'tarea', fecha: tarea.fecha, tarea }))
}

export function mergeEventsByDay(events: AgendaEvent[]): Map<string, AgendaEvent[]> {
  const map = new Map<string, AgendaEvent[]>()
  for (const event of events) {
    const existing = map.get(event.fecha)
    if (existing) {
      existing.push(event)
    } else {
      map.set(event.fecha, [event])
    }
  }
  return map
}
