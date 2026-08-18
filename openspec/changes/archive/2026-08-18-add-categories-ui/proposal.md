## Why

The backend (change `add-categories`, `FinanzappBackend`) replaces the free-form `categoria` string with a real, reusable `Categoria` entity supporting many-to-many assignment and an emoji from a fixed set. The frontend still shows a plain-text category input and a bare string in the concept header — this change wires the UI to the new contract: multi-category selection when creating/editing a concept, emoji display, and a dedicated screen to manage categories (rename, set emoji, delete) with changes reflected everywhere automatically.

## What Changes

- **BREAKING** (frontend-internal): `Concepto.categoria: string | null` is replaced by `Concepto.categorias: Categoria[]`; `ConceptoCreateInput`/`ConceptoUpdateInput`'s `categoria?: string` is replaced by `categoria_ids?: number[]`.
- Replace the free-text category input in `NewConceptForm.tsx` and `ConceptDetail.tsx`'s edit mode with a multi-select control: pick from existing categories, or type a new name to create one inline (no emoji at creation time).
- Display every assigned category's emoji (when set) next to a concept's name/type wherever its category was shown before (Concept Detail header).
- Add a new "Categorías" screen (`/categorias`, third link in `Header.tsx` alongside Dashboard/Deudas): list all categories, create one, rename it, set/change its emoji (from the fixed curated set), delete it.
- Renaming a category or changing its emoji is immediately visible on every concept using it, via query invalidation — no manual refresh.

## Capabilities

### New Capabilities
- `category-management`: the dedicated `/categorias` screen for creating, renaming, re-styling (emoji), and deleting categories.

### Modified Capabilities
- `concept-management`: the Concept Detail header's category display and edit form change from a single free-text string to multiple category chips with emojis, sourced from the real `Categoria` entity.
- `dashboard`: the new-concept creation form's category field changes from free text to a multi-select-with-inline-create control.

## Impact

- Frontend only: `src/types.ts`, `src/hooks/useCategorias.ts` (new), `src/components/NewConceptForm.tsx`, `src/pages/ConceptDetail.tsx`, `src/components/Header.tsx`, `src/App.tsx`, `src/pages/Categorias.tsx` (new), plus a new shared category-picker component.
- Depends on the backend change `add-categories` (`FinanzappBackend`) being implemented and deployed first — this change only consumes that API, it does not modify it.
- No reporting/analytics screens — out of scope, same as the backend change.
