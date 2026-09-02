export interface ChangelogEntry {
  id: string
  date: string
  title: string
  description: string
}

// Newest first. Add a new entry here whenever a notable feature ships -
// this list is the maintainer-curated "what's new" content, not
// auto-generated from commits.
export const CHANGELOG: ChangelogEntry[] = [
  {
    id: '2026-08-27-savings-card',
    date: '2026-08-27',
    title: 'Ahorros con su propia tarjeta',
    description: 'Ahorros ahora tiene su propia tarjeta en el Dashboard, más clara y fácil de editar.',
  },
  {
    id: '2026-08-27-abono-interest',
    date: '2026-08-27',
    title: 'Interés en abonos de deudores',
    description:
      'Al registrar un abono puedes indicar cuánto de ese pago fue interés — se suma a tus ingresos del mes sin afectar el saldo pendiente de capital.',
  },
  {
    id: '2026-08-27-split-add-buttons',
    date: '2026-08-27',
    title: 'Botón de ingreso separado',
    description:
      '"+ Agregar ingreso" ahora es su propio botón, directo, sin tener que buscarlo entre las otras opciones.',
  },
  {
    id: '2026-08-20-payment-priority',
    date: '2026-08-20',
    title: 'Prioridad de pago',
    description:
      'El Dashboard ahora te muestra qué pago es más urgente atender, calculado por fecha de vencimiento.',
  },
  {
    id: '2026-08-20-balance-breakdown',
    date: '2026-08-20',
    title: 'Desglose del balance del mes',
    description:
      'Haz clic en el balance del mes para ver exactamente qué conceptos y gastos lo componen.',
  },
  {
    id: '2026-08-19-landing-page',
    date: '2026-08-19',
    title: 'Nueva página de inicio',
    description: 'TOBE ahora tiene una página pública explicando de qué se trata, antes de iniciar sesión.',
  },
]
