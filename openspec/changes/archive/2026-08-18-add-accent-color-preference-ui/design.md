## Context

See proposal.md - Why. `src/index.css` today hardcodes `--accent`/`--accent-soft` per theme in `:root`/`.dark`. `src/hooks/useTheme.ts` is the closest existing precedent for applying a visual preference, but it's synchronous (reads `localStorage` in a `useState` initializer, zero network latency, so no flash). The accent color instead depends on an authenticated API call (`GET /users/me`), which is inherently async - a brief flash of the default color before the user's saved choice loads is unavoidable without a synchronous local cache, and is accepted here (see Risks).

## Goals / Non-Goals

**Goals:**
- Applying a chosen color touches only `--accent`; `--accent-soft` must follow automatically for every color, including the existing default, with zero hand-tuned values.
- The preference query/mutation is available from any component via a shared hook, without prop drilling.

**Non-Goals:**
- Eliminating the load-time flash entirely (accepted trade-off, not solved by a local cache in this change).
- Any additional accent shades beyond `--accent`/`--accent-soft` (e.g. hover/active variants derived further) - not used anywhere in the 65 existing call sites, so nothing to add.

## Decisions

**`--accent-soft` becomes a CSS-computed formula, not a second JS-set variable.** Replace the hardcoded `--accent-soft` values in `:root`/`.dark` with `color-mix()` expressions referencing `--accent`:
- Light: `--accent-soft: color-mix(in srgb, var(--accent) 12%, var(--paper));`
- Dark: `--accent-soft: color-mix(in srgb, var(--accent) 16%, transparent);`

Because `--accent-soft` is defined *in terms of* `--accent`, JS only ever needs to set `--accent` (one property, one value per theme) - `--accent-soft` recalculates automatically via the CSS cascade, for the default color and all 9 presets alike. This eliminates any need to hand-tune 18 "soft" values.

**Nine presets, `src/lib/accentColors.ts`, one light+dark hex pair each** (identifiers match the backend's `ALLOWED_ACCENT_COLORS` exactly):

| id | light `--accent` | dark `--accent` |
|---|---|---|
| verde (default) | `#3f6b4a` | `#85c091` |
| azul | `#2f5d8a` | `#7fb3e0` |
| morado | `#6b4c9a` | `#b79ae0` |
| rosa | `#a94a72` | `#e8a0bf` |
| naranja | `#a5601f` | `#e8a563` |
| amarillo | `#8a7415` | `#d9c25a` |
| rojo | `#a13d3d` | `#e08080` |
| turquesa | `#217a7a` | `#6ecece` |
| gris | `#5a5850` | `#b0ada2` |

`verde` reuses the app's current values exactly - a user with no saved preference (`color_acento: null`) sees no visual change from today. Non-`verde` presets follow the same lightness/saturation treatment as the existing green pair (muted, warm-leaning, dark-in-light/light-in-dark) to stay consistent with the "editorial ledger" palette rather than introducing neon or pastel outliers.

**`useAccentColor()` hook (TanStack Query), called both where the color is applied and where it's picked.** `useQuery({ queryKey: ['users', 'me'], queryFn: () => apiClient.get<UserRead>('/users/me'), enabled: isAuthenticated })` plus `useMutation` for `PATCH /users/me` that invalidates `['users', 'me']` on success - same shared-cache pattern already used throughout the app (e.g. `useGastos`), so `Header`'s picker and the top-level apply-effect both read the same query without prop drilling.

**Applying the color lives in `App.tsx` (mounted once for the session), not in `Header`** (remounted on every route change, since each page renders its own `<Header />`). An effect there watches the query's `color_acento` and sets `document.documentElement.style.setProperty('--accent', ...)` (picking the light/dark hex based on the current theme) whenever it changes - runs once per actual preference change, not once per navigation.

**Color changes apply optimistically, before the PATCH resolves.** Clicking a swatch immediately calls `document.documentElement.style.setProperty(...)` in the click handler itself (not waiting for the mutation), then fires the `PATCH` in the background. If the request fails, the visual change is left in place (not rolled back) and the picker shows a small inline error - reverting on failure would cause a jarring color flip-back the user didn't ask for, and the next successful mutation (or reload, which re-fetches truth from the server) reconciles it.

**Picker button: new, separate from the theme toggle** (a `Palette` icon from `lucide-react`, placed next to the existing Sun/Moon button in `Header.tsx`). Combining it into the theme button would mix two different interaction models (an immediate one-click toggle vs. an open-a-panel-and-choose flow) in a single control - keeping them separate preserves the theme toggle's existing one-click simplicity.

**Popover overlay/close behavior mirrors `Sidebar.tsx`**: backdrop click and Escape close it (same `useEffect`-scoped `keydown` listener pattern), selecting a color also closes it. Anchored near the trigger button (not full-screen) since it only needs to show 9 small swatches, unlike the Sidebar's full nav list.

## Risks / Trade-offs

- [Brief flash of the default/previous color on each fresh page load until `GET /users/me` resolves] → Accepted per Non-Goals; if it proves bothersome in testing, a follow-up could add a synchronous `localStorage` cache of the last-known value (mirroring how `apiClient` seeds its auth token synchronously today), but that's deferred rather than built speculatively here.
- [Optimistic apply-then-persist means a failed `PATCH` leaves the UI accent changed but not actually saved] → Mitigated by surfacing an inline error in the picker so the user knows to retry, without forcing a jarring revert.
