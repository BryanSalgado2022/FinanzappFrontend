// Mirrors the --viz-* custom properties in index.css. Recharts sets `stroke`/
// `fill` as literal SVG attributes, which don't reliably resolve CSS var() in
// every renderer, so these are duplicated here as plain hex rather than read
// from the stylesheet. Keep the two in sync if the palette changes.
export interface VizPalette {
  grid: string
  baseline: string
  muted: string
  series: string[]
}

export const VIZ_LIGHT: VizPalette = {
  grid: '#e1e0d9',
  baseline: '#c3c2b7',
  muted: '#898781',
  series: [
    '#2a78d6',
    '#eb6834',
    '#1baf7a',
    '#eda100',
    '#e87ba4',
    '#008300',
    '#4a3aa7',
    '#e34948',
  ],
}

export const VIZ_DARK: VizPalette = {
  grid: '#2c2c2a',
  baseline: '#383835',
  muted: '#898781',
  series: [
    '#3987e5',
    '#d95926',
    '#199e70',
    '#c98500',
    '#d55181',
    '#008300',
    '#9085e9',
    '#e66767',
  ],
}

export function vizPalette(theme: 'light' | 'dark'): VizPalette {
  return theme === 'dark' ? VIZ_DARK : VIZ_LIGHT
}
