import { useState } from 'react'
import { X } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { useCreateConcept } from '../hooks/useConcepts'
import { useCreateDeudor, useCreateAbono, useDeudores } from '../hooks/useDeudores'
import { useCreateGasto } from '../hooks/useGastos'
import { useCreateTarea } from '../hooks/useTareas'
import type { AgentEntity } from '../types'

type FieldKind = 'text' | 'money' | 'date' | 'number'
interface FieldConfig {
  key: string
  label: string
  kind: FieldKind
}

const ENTITY_LABEL: Record<AgentEntity, string> = {
  gasto: 'Gasto puntual',
  concepto: 'Concepto',
  tarea: 'Tarea',
  deudor: 'Deudor',
  abono: 'Abono',
}

const ENTITY_FIELDS: Record<AgentEntity, FieldConfig[]> = {
  gasto: [
    { key: 'descripcion', label: 'Descripción', kind: 'text' },
    { key: 'monto', label: 'Monto', kind: 'money' },
    { key: 'fecha', label: 'Fecha', kind: 'date' },
  ],
  concepto: [
    { key: 'nombre', label: 'Nombre', kind: 'text' },
    { key: 'tipo', label: 'Tipo', kind: 'text' },
    { key: 'valor_total', label: 'Valor total', kind: 'money' },
    { key: 'monto_planeado', label: 'Monto planeado', kind: 'money' },
    { key: 'tasa_interes', label: 'Tasa de interés (%)', kind: 'number' },
    { key: 'periodo_tasa', label: 'Periodo de tasa', kind: 'text' },
    { key: 'numero_cuotas', label: 'Número de cuotas', kind: 'number' },
    { key: 'dia_vencimiento', label: 'Día de vencimiento', kind: 'number' },
  ],
  tarea: [
    { key: 'titulo', label: 'Título', kind: 'text' },
    { key: 'fecha', label: 'Fecha', kind: 'date' },
    { key: 'hora', label: 'Hora', kind: 'text' },
    { key: 'nota', label: 'Nota', kind: 'text' },
  ],
  deudor: [
    { key: 'nombre', label: 'Nombre', kind: 'text' },
    { key: 'monto_total', label: 'Monto total', kind: 'money' },
    { key: 'fecha', label: 'Fecha', kind: 'date' },
    { key: 'garantia', label: 'Garantía', kind: 'text' },
  ],
  abono: [
    { key: 'monto', label: 'Monto', kind: 'money' },
    { key: 'fecha', label: 'Fecha', kind: 'date' },
  ],
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

function buildInitialValues(entity: AgentEntity, fields: Record<string, unknown>): Record<string, string> {
  const values: Record<string, string> = {}
  for (const { key } of ENTITY_FIELDS[entity]) {
    if (fields[key] !== undefined && fields[key] !== null) {
      values[key] = String(fields[key])
    }
  }
  return values
}

export function AgentProposedActionCard({
  entity,
  fields,
  onDone,
  onDismiss,
}: {
  entity: AgentEntity
  fields: Record<string, unknown>
  onDone: (summary: string) => void
  onDismiss: () => void
}) {
  const [values, setValues] = useState(() => buildInitialValues(entity, fields))
  const [error, setError] = useState<string | null>(null)

  const createGasto = useCreateGasto()
  const createConcept = useCreateConcept()
  const createTarea = useCreateTarea()
  const createDeudor = useCreateDeudor()
  const deudores = useDeudores()
  const deudorId = entity === 'abono' ? Number(fields.deudor_id) : null
  const createAbono = useCreateAbono(deudorId ?? 0)

  const setField = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }))

  const handleConfirm = async () => {
    setError(null)
    try {
      if (entity === 'gasto') {
        await createGasto.mutateAsync({
          monto: values.monto,
          fecha: values.fecha,
          descripcion: values.descripcion,
        })
        onDone(`Gasto "${values.descripcion}" registrado.`)
      } else if (entity === 'concepto') {
        await createConcept.mutateAsync({
          nombre: values.nombre,
          tipo: values.tipo as 'deuda' | 'gasto_fijo' | 'ingreso',
          valor_total: values.valor_total || undefined,
          monto_planeado: values.monto_planeado || undefined,
          tasa_interes: values.tasa_interes || undefined,
          periodo_tasa: (values.periodo_tasa as 'mensual' | 'anual') || undefined,
          numero_cuotas: values.numero_cuotas ? Number(values.numero_cuotas) : undefined,
          dia_vencimiento: values.dia_vencimiento ? Number(values.dia_vencimiento) : undefined,
        })
        onDone(`Concepto "${values.nombre}" registrado.`)
      } else if (entity === 'tarea') {
        await createTarea.mutateAsync({
          titulo: values.titulo,
          fecha: values.fecha || undefined,
          hora: values.hora || undefined,
          nota: values.nota || undefined,
        })
        onDone(`Tarea "${values.titulo}" registrada.`)
      } else if (entity === 'deudor') {
        await createDeudor.mutateAsync({
          nombre: values.nombre,
          monto_total: values.monto_total,
          fecha: values.fecha,
          garantia: values.garantia || undefined,
        })
        onDone(`Deudor "${values.nombre}" registrado.`)
      } else if (entity === 'abono') {
        await createAbono.mutateAsync({ monto: values.monto, fecha: values.fecha })
        onDone('Abono registrado.')
      }
    } catch {
      setError('No se pudo guardar. Revisa los datos e intenta de nuevo.')
    }
  }

  const isPending =
    createGasto.isPending ||
    createConcept.isPending ||
    createTarea.isPending ||
    createDeudor.isPending ||
    createAbono.isPending

  const deudorNombre =
    entity === 'abono' ? deudores.data?.find((d) => d.id === deudorId)?.nombre : undefined

  return (
    <div className="space-y-2.5 rounded-2xl border border-line bg-paper-raised p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
          {ENTITY_LABEL[entity]}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Descartar"
          className="flex h-6 w-6 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      {entity === 'abono' && (
        <p className="text-sm text-ink">
          Para: <span className="font-medium">{deudorNombre ?? `deudor #${deudorId}`}</span>
        </p>
      )}

      {ENTITY_FIELDS[entity].map(({ key, label, kind }) => {
        if (values[key] === undefined) return null
        return (
          <div key={key}>
            <label className="mb-1 block text-xs text-ink-muted">{label}</label>
            {kind === 'money' ? (
              <MoneyInput value={values[key]} onChange={(v) => setField(key, v)} className={inputClass} />
            ) : (
              <input
                type={kind === 'date' ? 'date' : kind === 'number' ? 'number' : 'text'}
                value={values[key]}
                onChange={(e) => setField(key, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        )
      })}

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full px-3 py-1.5 text-sm text-ink-muted transition hover:text-ink"
        >
          Descartar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : 'Confirmar'}
        </button>
      </div>
    </div>
  )
}
