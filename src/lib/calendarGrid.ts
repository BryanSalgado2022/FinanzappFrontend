export interface CalendarCell {
  // "YYYY-MM-DD"
  date: string
  inMonth: boolean
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function toIso(anio: number, mes: number, dia: number): string {
  return `${anio}-${pad2(mes)}-${pad2(dia)}`
}

// `new Date(anio, mesIndex, dia)` constructs from local calendar components
// directly - unlike parsing a "YYYY-MM-DD" string (which formatFecha avoids
// for the UTC-midnight timezone bug), this never round-trips through UTC.
function daysInMonth(anio: number, mes: number): number {
  return new Date(anio, mes, 0).getDate()
}

// Always 6 rows x 7 columns, including the trailing days of the
// previous/next month needed to fill the first/last week - a fixed row
// count keeps the grid's height stable across months.
export function buildMonthGrid(anio: number, mes: number): CalendarCell[][] {
  const firstWeekday = new Date(anio, mes - 1, 1).getDay()
  const totalDays = daysInMonth(anio, mes)

  const prevMes = mes === 1 ? 12 : mes - 1
  const prevAnio = mes === 1 ? anio - 1 : anio
  const totalDaysPrevMonth = daysInMonth(prevAnio, prevMes)

  const nextMes = mes === 12 ? 1 : mes + 1
  const nextAnio = mes === 12 ? anio + 1 : anio

  const cells: CalendarCell[] = []

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ date: toIso(prevAnio, prevMes, totalDaysPrevMonth - i), inMonth: false })
  }
  for (let dia = 1; dia <= totalDays; dia++) {
    cells.push({ date: toIso(anio, mes, dia), inMonth: true })
  }
  let nextDia = 1
  while (cells.length < 42) {
    cells.push({ date: toIso(nextAnio, nextMes, nextDia), inMonth: false })
    nextDia++
  }

  const grid: CalendarCell[][] = []
  for (let row = 0; row < 6; row++) {
    grid.push(cells.slice(row * 7, row * 7 + 7))
  }
  return grid
}
