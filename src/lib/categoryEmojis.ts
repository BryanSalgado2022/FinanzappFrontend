// Fixed, curated set of emojis a category may use - must stay identical to
// the backend's ALLOWED_CATEGORIA_EMOJIS (app/models/categoria.py), which
// rejects anything outside this list.
export const ALLOWED_CATEGORY_EMOJIS = [
  '💰',
  '🏦',
  '💳',
  '🏠',
  '🚗',
  '🍽️',
  '💊',
  '✈️',
  '🎂',
  '❤️',
  '🎯',
  '💡',
  '💧',
  '🛒',
  '📅',
  '📱',
] as const
