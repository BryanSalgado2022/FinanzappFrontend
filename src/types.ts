export type TipoConcepto = 'deuda' | 'gasto_fijo' | 'ingreso'
export type PeriodoTasa = 'mensual' | 'anual'

export interface Concepto {
  id: number
  nombre: string
  tipo: TipoConcepto
  categoria: string | null
  valor_total: string | null
  saldo_restante: string | null
  tasa_interes: string | null
  periodo_tasa: PeriodoTasa | null
  numero_cuotas: number | null
  cuota_fija: string | null
  duracion_meses: number | null
  dia_vencimiento: number | null
  activo: boolean
}

export interface ConceptoCreateInput {
  nombre: string
  tipo: TipoConcepto
  categoria?: string
  valor_total?: string
  monto_planeado?: string
  // Amortization terms (deuda only, optional): tasa_interes and numero_cuotas
  // must be provided together. Immutable after creation - see FinanzappBackend.
  tasa_interes?: string
  periodo_tasa?: PeriodoTasa
  numero_cuotas?: number
  // Fixed duration (gasto_fijo/ingreso only, optional, immutable): generates
  // exactly this many months at creation instead of the open-ended behavior.
  duracion_meses?: number
  // Due day (1-28, deuda/gasto_fijo only, optional). Unlike the fields above,
  // this stays editable after creation - see ConceptoUpdateInput.
  dia_vencimiento?: number
}

export interface ConceptoUpdateInput {
  nombre?: string
  categoria?: string
  activo?: boolean
  valor_total?: string
  dia_vencimiento?: number
}

export interface EntradaMensual {
  id: number
  concepto_id: number
  anio: number
  mes: number
  monto_planeado: string
  monto_pagado: string | null
  pagado: boolean
  vencida: boolean
}

export interface EntradaMensualInput {
  monto_planeado: string
  monto_pagado?: string
  pagado?: boolean
}

export interface MonthlySummary {
  anio: number
  mes: number
  total_ingresos: string
  total_gastos: string
  balance_neto: string
}

export interface DebtComposition {
  concepto_id: number
  nombre: string
  saldo_restante: string
}

export interface DebtsSummary {
  numero_deudas: number
  total_adeudado: string
  total_pagado: string
  saldo_total_restante: string
  progreso_porcentaje: string
  composicion: DebtComposition[]
}

export interface AnnualMonthTotal {
  mes: number
  total_ingresos: string
  total_gastos: string
}

export interface AnnualTrend {
  anio: number
  meses: AnnualMonthTotal[]
}

// The backend has no "get current user" endpoint and its JWT payload only
// carries the user id (see FinanzappBackend design.md). Display info (name,
// email, picture) comes from decoding the Google credential JWT client-side
// at sign-in time - it's never used for auth decisions, only for the UI.
export interface User {
  email: string
  name: string
  picture?: string
}
