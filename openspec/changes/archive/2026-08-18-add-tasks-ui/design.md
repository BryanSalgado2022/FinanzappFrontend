## Context

See proposal.md for motivation. Relevant current state:

- `Categorias.tsx`/`useCategorias.ts` is the closest existing screen pattern: list + inline-accordion edit + delete, TanStack Query hooks with invalidate-on-success mutations. Categorías' creation is a simple top-of-page input, but a task needs several fields (título, emoji, fecha, hora, nota) — too many for that inline pattern.
- `NewConceptForm.tsx` is the modal pattern to mirror for creation: fixed overlay (`bg-ink/50 backdrop-blur-sm`), a form with several fields, Cancelar/Crear buttons.
- `MonthEntryRow.tsx`'s `Node` component and `PagadoToggle` are the two visual patterns to reuse: `Node`'s danger styling (`border-danger`, `bg-danger-soft`, `AlertTriangle`) for the overdue state, and `PagadoToggle`'s pill-button pattern for a binary "mark as done" action.
- No existing screen in this codebase groups a single list into two visually separate sections (dated vs. undated) — `ConceptDetail.tsx`'s quarter grouping is the closest precedent (grouping in general), but that's calendar-quarter based, not "has a value vs. doesn't."

## Goals / Non-Goals

**Goals:**
- Reuse existing visual patterns (`Node`'s overdue styling, `PagadoToggle`'s pill toggle, `NewConceptForm`'s modal shell, `Categorias.tsx`'s accordion row) rather than inventing new ones, so Tareas reads as part of the same app rather than a bolted-on feature.

**Non-Goals:**
- No date-range filtering, search, or pagination — matches Categorías' "just a list" simplicity given expected task volumes.
- No optimistic UI — same invalidate-then-refetch convention as every other mutation hook in this codebase.

## Decisions

**List structure: two `<ul>` sections — "Con fecha" (sorted ascending) and "Sin fecha" — not a single flat list with mixed sorting.**
Mixing dated and undated tasks in one sort order forces an arbitrary placement decision for undated items (top? bottom? by creation date?) that has no natural answer. Two explicit sections, exactly as grilled, removes the ambiguity: the dated section is a straightforward ascending sort by `fecha`, and the undated section can use a simple secondary order (creation order, i.e. the order the API returns them) since there's no field to meaningfully sort by within it.

**Row layout combines `completada` toggle, overdue styling, and emoji in one place — same row as the title, not a separate line.**
A task row shows, left to right: a small `PagadoToggle`-style circular toggle for `completada` (reusing `Node`'s circle-with-check visual for the "done" state), the task's emoji (if set), the título, and — when `vencida` is true — the danger-styled treatment (border/icon) applied to the toggle itself, exactly mirroring how `Node` overloads a single circular element to communicate paid/overdue/pending in `MonthEntryRow`. This keeps the row compact and reuses the exact visual vocabulary the user already recognizes from Concept Detail, rather than adding a separate "overdue" badge or label element.

**Creation modal is a new, separate component (`NewTaskForm.tsx`), not a generalized/shared modal shell extracted from `NewConceptForm.tsx`.**
`NewConceptForm.tsx` has debt/amortization-specific fields with no task equivalent; forcing a shared abstraction now would either leak concept-specific concerns into the task form or require a premature generalization. Duplicating the modal's outer shell markup (a few lines: overlay div + form container classes) is cheap and keeps each form independently editable, consistent with how this codebase hasn't extracted a shared modal wrapper anywhere else yet.

**Emoji picker for tasks is a new grid component, not a reuse of the categories emoji grid.**
`Categorias.tsx`'s `EmojiPicker` is a private, non-exported component scoped to that file, and it consumes `ALLOWED_CATEGORY_EMOJIS`. Since Tareas needs the same grid *shape* but a different emoji set (`ALLOWED_TASK_EMOJIS`), the pragmatic choice is a small parallel `EmojiPicker` inside `NewTaskForm.tsx` (or a shared generic one parameterized by an emoji list, if it turns out to be trivial to extract during implementation — left as an implementation-time call, not a spec-level decision).

## Risks / Trade-offs

[Duplicating the modal shell and emoji grid between concepts/categories and tasks costs some repeated markup] → Accepted: the codebase's existing pattern is one component per screen/form rather than shared abstractions, and premature extraction across three different fixed emoji sets (categories, tasks, and whatever a future capability needs) risks guessing the wrong shared interface. Revisit if a third consumer appears.
