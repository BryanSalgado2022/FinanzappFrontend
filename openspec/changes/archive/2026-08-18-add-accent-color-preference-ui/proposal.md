## Why

The backend's `add-accent-color-preference` change (FinanzappBackend) adds a `color_acento` field on `User` and `GET`/`PATCH /users/me`, but nothing in the frontend lets a user see or choose it, or reflects it visually.

## What Changes

- Add a color-swatch popover (9 curated colors) opened from a new button in the Header, next to the light/dark toggle.
- Selecting a color immediately overrides the `--accent` CSS custom property on the document root and persists the choice via `PATCH /users/me`.
- On sign-in / app load, fetch the saved color via `GET /users/me` and apply it.
- `--accent-soft` stops being a hardcoded value per theme and becomes a `color-mix()` formula derived from `--accent`, so every preset (and the existing default) gets a soft variant for free without hand-tuning 18 values.

## Capabilities

### New Capabilities
- `user-preferences`: lets the user view and change their accent color from anywhere in the app, with the choice persisted to their account and applied immediately.

## Impact

- New: `src/hooks/useAccentColor.ts`, `src/components/AccentColorPicker.tsx`, `src/lib/accentColors.ts` (the 9 presets' hex values).
- Modified: `src/index.css` (`--accent-soft` becomes a `color-mix()` formula instead of a static value), `src/components/Header.tsx` (new picker button), `src/types.ts` (`User.color_acento`, request/response shapes for `/users/me`).
- No changes to any page component.
