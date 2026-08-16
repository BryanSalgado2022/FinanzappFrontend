import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '../hooks/useTheme'
import { formatCOP } from '../lib/format'
import { vizPalette } from '../lib/vizColors'
import type { DebtComposition } from '../types'

const MAX_SLOTS = 8

export function DebtCompositionChart({ composicion }: { composicion: DebtComposition[] }) {
  const { theme } = useTheme()
  const viz = vizPalette(theme)

  const ordenada = [...composicion].sort(
    (a, b) => Number(b.saldo_restante) - Number(a.saldo_restante),
  )

  // A categorical palette validated for adjacent comparison caps at 8 slots
  // (dataviz skill) - beyond that, fold the smallest debts into "Otras"
  // rather than generating a new hue.
  const visibles = ordenada.slice(0, MAX_SLOTS - 1)
  const resto = ordenada.slice(MAX_SLOTS - 1)
  const data = [...visibles.map((d) => ({ nombre: d.nombre, saldo: Number(d.saldo_restante) }))]
  if (resto.length > 0) {
    data.push({
      nombre: `Otras (${resto.length})`,
      saldo: resto.reduce((sum, d) => sum + Number(d.saldo_restante), 0),
    })
  }

  const height = Math.max(120, data.length * 40)

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="nombre"
            width={110}
            stroke={viz.muted}
            tick={{ fill: viz.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => formatCOP(Number(value))}
            contentStyle={{
              background: 'var(--paper-raised)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Bar dataKey="saldo" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((_, index) => (
              <Cell key={index} fill={viz.series[index % viz.series.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
