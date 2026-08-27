## Context

The backend change `add-available-balance` (sibling, FinanzappBackend) exposes `ahorros`/`saldo_disponible_inicial`/`saldo_disponible_fecha` on `UserRead`/`UserUpdate` (same pattern as the existing `color_acento` preference, read via `useCurrentUser()`/`GET /users/me`), plus a new `GET /summary/disponible` returning `{ disponible: string | null, saldo_disponible_fecha: string | null }`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Reuse the existing `useCurrentUser`/accent-color mutation pattern for `ahorros`/`saldo_disponible_inicial` rather than inventing a new preferences flow.
- Make the "first configure, then re-baseline" distinction from the backend legible in the UI without extra copy explaining re-baselining mechanics.

**Non-Goals:**
- Any transaction history/ledger UI for Ahorros or Disponible (both are single editable numbers, per the grilled decision).
- Changing anything about the existing "Balance del mes" card.

## Decisions

**Inline editing, not a modal**: both Ahorros and the Disponible baseline are single numbers edited via a click-to-edit `MoneyInput` directly in the card (matching the lightweight editing pattern already used for monthly entry amounts in `MonthEntryRow.tsx`), rather than opening a separate modal — these are simple value edits, not multi-field forms.

**Setup vs. edit share one input**: the "first-time setup" prompt and "edit Disponible" affordance are the same UI element — `saldo_disponible_fecha === null` (from `useDisponible()`'s response) controls whether the card shows prompt copy ("¿Cuánto tienes disponible hoy?") or the current figure, but both paths submit through the same `PATCH /users/me` mutation with `saldo_disponible_inicial`. No separate "setup wizard" component.

**Query invalidation**: editing `saldo_disponible_inicial` invalidates both `['users','me']` (existing key) and a new `['summary','disponible']` key, since the backend re-baselines the date as a side effect of that same request — the Disponible figure must refetch even though the mutation's request body didn't touch it directly.

**Warning copy**: "Estás gastando $X más de lo que has recibido" plus, when Ahorros is set, "— tienes $Y en ahorros" appended; when Ahorros is unset, the sentence ends after the deficit, per the spec's "no warning references an unset Ahorros figure" scenario.

## Risks / Trade-offs

- [Risk] A user who ignores the setup prompt indefinitely never benefits from this feature. → Mitigation: acceptable — the feature is opt-in by design (per grilling, Disponible needs a real baseline to mean anything, so there's no sensible auto-default to force it on the user).
