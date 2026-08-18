export interface AccentColorPreset {
  id: string
  label: string
  light: string
  dark: string
}

// Identifiers must match the backend's ALLOWED_ACCENT_COLORS exactly.
// "verde" reuses the app's original default values, so a user with no
// saved preference sees no visual change.
export const ACCENT_COLOR_PRESETS: AccentColorPreset[] = [
  { id: 'verde', label: 'Verde', light: '#3f6b4a', dark: '#85c091' },
  { id: 'azul', label: 'Azul', light: '#2f5d8a', dark: '#7fb3e0' },
  { id: 'morado', label: 'Morado', light: '#6b4c9a', dark: '#b79ae0' },
  { id: 'rosa', label: 'Rosa', light: '#a94a72', dark: '#e8a0bf' },
  { id: 'naranja', label: 'Naranja', light: '#a5601f', dark: '#e8a563' },
  { id: 'amarillo', label: 'Amarillo', light: '#8a7415', dark: '#d9c25a' },
  { id: 'rojo', label: 'Rojo', light: '#a13d3d', dark: '#e08080' },
  { id: 'turquesa', label: 'Turquesa', light: '#217a7a', dark: '#6ecece' },
  { id: 'gris', label: 'Gris', light: '#5a5850', dark: '#b0ada2' },
]

export const DEFAULT_ACCENT_COLOR_ID = 'verde'

export function getAccentColorPreset(id: string | null): AccentColorPreset {
  return (
    ACCENT_COLOR_PRESETS.find((preset) => preset.id === id) ??
    ACCENT_COLOR_PRESETS.find((preset) => preset.id === DEFAULT_ACCENT_COLOR_ID)!
  )
}
