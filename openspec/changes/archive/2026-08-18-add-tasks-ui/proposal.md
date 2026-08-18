## Why

The backend (change `add-tasks`, `FinanzappBackend`) adds a standalone `Tarea` entity for generic reminders/appointments, independent of the app's financial concepts. This change gives the user a screen to create, view, complete, and manage those tasks — the first of three future-facing ideas noted from a reference app, deliberately scoped to just task management with no calendar view or Dashboard integration yet.

## What Changes

- Add a new "Tareas" screen (`/tareas`, fourth link in `Header.tsx` alongside Dashboard/Deudas/Categorías): a chronological list of tasks, ordered by date ascending with undated tasks grouped in their own section.
- Add a creation modal (titulo, emoji picker, fecha, hora, nota) mirroring `NewConceptForm.tsx`'s pattern.
- Add inline accordion editing per task row (mirroring `Categorias.tsx`), including a `completada` toggle and delete.
- Overdue tasks (`vencida: true` from the backend) are visually distinguished using the same danger styling already used for overdue monthly entries.
- No recurrence/frequency UI — deliberately out of scope until a future calendar view exists.
- No integration with the Dashboard or any other screen — Tareas is fully standalone, like Categorías.

## Capabilities

### New Capabilities
- `task-management`: the dedicated `/tareas` screen for creating, listing, completing, editing, and deleting tasks.

## Impact

- Frontend only: `src/types.ts`, `src/lib/taskEmojis.ts` (new), `src/hooks/useTareas.ts` (new), `src/components/Header.tsx`, `src/App.tsx`, `src/pages/Tareas.tsx` (new), `src/components/NewTaskForm.tsx` (new, modal).
- Depends on the backend change `add-tasks` (`FinanzappBackend`) being implemented and deployed first — this change only consumes that API, it does not modify it.
- No changes to any existing screen or capability.
