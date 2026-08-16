export type TipoConcepto = 'deuda' | 'gasto_fijo' | 'ingreso'

export interface Concepto {
  id: number
  nombre: string
  tipo: TipoConcepto
  categoria: string | null
  valor_total: string | null
  saldo_restante: string | null
  activo: boolean
}

export interface ConceptoCreateInput {
  nombre: string
  tipo: TipoConcepto
  categoria?: string
  valor_total?: string
  monto_planeado?: string
}

export interface ConceptoUpdateInput {
  nombre?: string
  categoria?: string
  activo?: boolean
  valor_total?: string
}

export interface EntradaMensual {
  id: number
  concepto_id: number
  anio: number
  mes: number
  monto_planeado: string
  monto_pagado: string | null
  pagado: boolean
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

// The backend has no "get current user" endpoint and its JWT payload only
// carries the user id (see FinanzappBackend design.md). Display info (name,
// email, picture) comes from decoding the Google credential JWT client-side
// at sign-in time - it's never used for auth decisions, only for the UI.
export interface User {
  email: string
  name: string
  picture?: string
}
