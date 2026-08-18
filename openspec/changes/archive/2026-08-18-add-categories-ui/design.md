## Context

See proposal.md for motivation. Relevant current state:

- `Concepto.categoria: string | null` (frontend `src/types.ts`) mirrors the backend's old free-text field, consumed as plain text in `NewConceptForm.tsx` and `ConceptDetail.tsx`'s edit mode, and displayed as plain text in the Concept Detail header.
- No combobox, tag-input, or multi-select component exists anywhere in the codebase today — every form field so far is a plain `<input>`/`<select>` styled with the shared `inputClass` Tailwind string.
- `Header.tsx`'s nav is a fixed two-item list (`NavLink to="/" end` / `NavLink to="/deudas"`) using a shared `navLinkClass` function and `lucide-react` icons, with labels hidden below `sm` breakpoint.
- TanStack Query hooks (`useConcepts.ts`) follow a consistent shape: one `useQuery` per read, one `useMutation` per write, invalidating relevant query keys in `onSuccess`.
- This depends on the backend change `add-categories` (`FinanzappBackend`) being implemented first: `GET/POST /categorias`, `PATCH/DELETE /categorias/{id}`, and `categoria_ids`/`categorias` on the concept endpoints.

## Goals / Non-Goals

**Goals:**
- One shared category-picker component used by both `NewConceptForm.tsx` and `ConceptDetail.tsx`'s edit mode, so the multi-select + inline-create behavior is implemented once.
- Renaming/re-styling a category on the Categorías screen is visible on Dashboard/Concept Detail without a manual reload, via query invalidation.

**Non-Goals:**
- No drag-to-reorder, search/filter, or pagination on the Categorías screen — the user's real category count today is 9; a plain list is sufficient.
- No optimistic UI for category mutations — the existing hooks in this codebase (`useUpsertEntry`, `useDeleteEntry`, etc.) all invalidate-then-refetch rather than optimistically update; staying consistent with that pattern rather than introducing a new one for categories alone.

## Decisions

**One shared `<CategoryPicker>` component, not two separate implementations.**
Both `NewConceptForm.tsx` (create) and `ConceptDetail.tsx` (edit) need the exact same behavior: show selected categories as removable chips, a text input to filter/search existing categories, click an existing one to add it, or press Enter on a name that matches nothing to create-and-add it inline. Building this once as `src/components/CategoryPicker.tsx` (props: `selectedIds: number[]`, `onChange: (ids: number[]) => void`) avoids the two forms drifting in behavior, matching how `MoneyInput.tsx` is already shared between multiple forms.

**Inline creation calls the existing `useCreateCategoria` mutation directly from the picker, not a separate "pending new categories" draft state.**
Because the backend's `POST /categorias` is idempotent-by-name (find-or-create, per the backend design.md), the picker can call it immediately when the user commits a new name (Enter/blur), get back a real `id`, and add that id to `selectedIds` right away — no need to track "categories to be created on form submit" as separate client-side state. This also means a category typed into the picker exists immediately (visible on the Categorías screen) even if the user then cancels the concept form without saving — an accepted, minor side effect called out under Risks below, not a bug.

**Emoji picker on the Categorías screen: fixed grid of the same 16 emoji, hardcoded client-side.**
The backend rejects anything outside its fixed set, so the frontend hardcodes the identical list as a constant (`ALLOWED_CATEGORY_EMOJIS` in `src/lib/categoryEmojis.ts`) rather than fetching it from an endpoint — there is no such endpoint, and the set is stable/curated by design (see backend design.md's rationale for why it isn't user-extensible). Rendered as a small grid of tappable emoji buttons (mirroring the reference screenshot's layout the user shared: a wrapping grid, no scroll), plus a "no emoji" option to clear it.

**Categorías screen layout: simple list with inline rename/emoji-edit, not a separate edit page.**
Given the low category count and that the two editable fields (`nombre`, `emoji`) are small, each row expands inline (same accordion pattern already used for `MonthEntryRow` in Concept Detail: click a row to edit its name and emoji in place, Guardar/Cancelar, Eliminar) rather than navigating to `/categorias/:id`. This reuses an established interaction pattern instead of introducing a new one.

**Category display order in chips/lists: as returned by the backend, no client-side sort.**
The backend has no defined ordering guarantee for `categorias` on a concept; rather than impose an arbitrary client-side sort (alphabetical, by id, by recency) that could shift chip order unpredictably across screens, the frontend renders them in whatever order the API returns, consistent with how the app already handles ordering-agnostic lists elsewhere (e.g. the Dashboard's concept lists).

## Risks / Trade-offs

[Typing a new category name and then abandoning the concept form still leaves that category created] → Accepted: this mirrors the backend's explicit find-or-create-by-name design (a deliberate simplification, not an oversight — see backend design.md), and an unused, empty category is harmless and easy to delete later from the Categorías screen. Not worth adding draft/rollback complexity for.

[Deleting a category from the Categorías screen while a concept form has it selected in an open, unsaved picker elsewhere] → Out of scope: this app has no multi-tab/real-time sync today (every other mutation already has the same "stale until refetch" property), so this isn't a new class of risk introduced by this change.
