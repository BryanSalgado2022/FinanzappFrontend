import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../hooks/useTheme'
import { formatCOP, monthShort } from '../lib/format'
import { vizPalette } from '../lib/vizColors'
import type { AnnualTrend } from '../types'

export function AnnualTrendChart({ trend }: { trend: AnnualTrend }) {
  const { theme } = useTheme()
  const viz = vizPalette(theme)

  const data = trend.meses.map((m) => ({
    mes: monthShort(m.mes),
    Ingresos: Number(m.total_ingresos),
    Gastos: Number(m.total_gastos),
  }))

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={viz.grid} vertical={false} />
          <XAxis
            dataKey="mes"
            stroke={viz.muted}
            tick={{ fill: viz.muted, fontSize: 11 }}
            axisLine={{ stroke: viz.baseline }}
            tickLine={false}
          />
          <YAxis
            stroke={viz.muted}
            tick={{ fill: viz.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => formatCOP(value)}
            width={72}
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
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="Ingresos"
            stroke={viz.series[0]}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Gastos"
            stroke={viz.series[1]}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
