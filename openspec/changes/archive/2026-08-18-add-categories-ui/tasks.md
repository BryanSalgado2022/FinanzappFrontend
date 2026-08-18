## 1. Types and data layer

- [x] 1.1 In `src/types.ts`: add `Categoria { id: number; nombre: string; emoji: string | null }`; replace `Concepto.categoria: string | null` with `Concepto.categorias: Categoria[]`; replace `categoria?: string` with `categoria_ids?: number[]` on `ConceptoCreateInput` and `ConceptoUpdateInput`
- [x] 1.2 Create `src/lib/categoryEmojis.ts` exporting `ALLOWED_CATEGORY_EMOJIS` (the fixed 16-emoji list, identical to the backend's set)
- [x] 1.3 Create `src/hooks/useCategorias.ts`: `useCategorias()` (list), `useCreateCategoria()`, `useUpdateCategoria(id)`, `useDeleteCategoria(id)` — mutations invalidate the categories list query AND the concepts list/detail query keys (per design.md, so renames/deletes show up immediately elsewhere)

## 2. Shared category picker

- [x] 2.1 Create `src/components/CategoryPicker.tsx`: props `selectedIds: number[]`, `onChange: (ids: number[]) => void`; renders selected categories as removable chips (with emoji if set), a text input to filter existing categories, click-to-add from a dropdown of matches, and create-on-Enter for a name with no match (calling `useCreateCategoria`)

## 3. Wire into concept creation and editing

- [x] 3.1 Replace the free-text category `<input>` in `NewConceptForm.tsx` with `<CategoryPicker>`; thread `categoria_ids` into the create payload
- [x] 3.2 Replace the free-text category `<input>` (`categoriaDraft`) in `ConceptDetail.tsx`'s edit mode with `<CategoryPicker>`; thread `categoria_ids` into the update payload; initialize `selectedIds` from `c.categorias` when entering edit mode
- [x] 3.3 Update the Concept Detail header (non-edit view) to render each assigned category's emoji (skip categories with no emoji) instead of the old `` · {categoria} `` text

## 4. Categorías screen

- [x] 4.1 Add "Categorías" `NavLink` to `Header.tsx` (third link, same pattern/icon style as Dashboard/Deudas)
- [x] 4.2 Add `/categorias` route in `App.tsx` inside the authenticated route group
- [x] 4.3 Create `src/pages/Categorias.tsx`: list of categories, each row expandable inline (accordion pattern, mirroring `MonthEntryRow`) to edit `nombre` and `emoji` (grid of `ALLOWED_CATEGORY_EMOJIS`; no "clear emoji" option since the backend's PATCH can't explicitly clear an already-set emoji, matching the None-means-unchanged convention used elsewhere) with Guardar/Cancelar, and an Eliminar action
- [x] 4.4 Add a create-category control on the Categorías screen (name input + submit)

## 5. Manual verification in the browser

- [x] 5.1 Create a concept selecting multiple existing categories; confirm all are assigned and shown with their emojis in Concept Detail
- [x] 5.2 Create a concept typing a brand-new category name inline; confirm it's created (visible on `/categorias`) and assigned, with no emoji
- [x] 5.3 From `/categorias`, rename a category in use and confirm the Concept Detail header updates without a manual reload
- [x] 5.4 From `/categorias`, set an emoji on a category in use and confirm it appears on the concept
- [x] 5.5 From `/categorias`, delete a category in use and confirm the concept keeps its other categories and no longer shows the deleted one
- [x] 5.6 Confirm the emoji picker only offers the fixed set (no free text) and that the Categorías screen and picker both render correctly in light/dark mode and on a mobile viewport
