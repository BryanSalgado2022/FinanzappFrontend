// Fixed, curated set of emojis a task may use - must stay identical to the
// backend's ALLOWED_TAREA_EMOJIS (app/models/tarea.py), which rejects
// anything outside this list. Reminder-oriented, distinct from
// ALLOWED_CATEGORY_EMOJIS (finance-oriented).
export const ALLOWED_TASK_EMOJIS = [
  '✅',
  '⏰',
  '🔔',
  '📞',
  '📄',
  '☀️',
  '🎂',
  '🚗',
  '🍽️',
  '🏠',
  '💊',
  '❤️',
  '🎯',
  '✈️',
  '🛒',
  '⚡',
  '💧',
  '🏦',
  '💰',
  '📅',
] as const
