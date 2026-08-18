## 1. Types and data layer

- [x] 1.1 In `src/types.ts`: add `Tarea { id: number; titulo: string; emoji: string | null; fecha: string | null; hora: string | null; nota: string | null; completada: boolean; vencida: boolean }`, `TareaCreateInput { titulo: string; emoji?: string; fecha?: string; hora?: string; nota?: string }`, `TareaUpdateInput { titulo?: string; emoji?: string; fecha?: string; hora?: string; nota?: string; completada?: boolean }`
- [x] 1.2 Create `src/lib/taskEmojis.ts` exporting `ALLOWED_TASK_EMOJIS` (the fixed ~20-emoji reminder-oriented set, matching the backend's `ALLOWED_TAREA_EMOJIS`)
- [x] 1.3 Create `src/hooks/useTareas.ts`: `useTareas()` (list), `useCreateTarea()`, `useUpdateTarea(id)`, `useDeleteTarea(id)` — mutations invalidate the tasks list query on success, mirroring `useCategorias.ts`'s shape

## 2. Creation modal

- [x] 2.1 Create `src/components/NewTaskForm.tsx`: modal (overlay + form, mirroring `NewConceptForm.tsx`'s shell) with título (required text input), emoji picker grid (`ALLOWED_TASK_EMOJIS`), fecha (`<input type="date">`), hora (`<input type="time">`), nota (textarea), Cancelar/Crear buttons

## 3. Tareas screen

- [x] 3.1 Add "Tareas" `NavLink` to `Header.tsx` (fourth link, same pattern/icon style as Dashboard/Deudas/Categorías)
- [x] 3.2 Add `/tareas` route in `App.tsx` inside the authenticated route group
- [x] 3.3 Create `src/pages/Tareas.tsx`: fetches tasks via `useTareas()`, splits into dated (sorted ascending by `fecha`) and undated sections, renders each as a `TareaRow`, includes a "+ Nueva" button opening `NewTaskForm`
- [x] 3.4 Build `TareaRow` (in `Tareas.tsx` or its own file): non-expanded view shows a `completada` toggle (circular, reusing `Node`'s check/danger visual language for done/overdue), emoji (if set), título, and date/time (if set); expanded view (accordion) shows editable fields for título/emoji/fecha/hora/nota with Guardar/Cancelar, and a left-aligned Eliminar button matching the pattern already used in `Categorias.tsx`'s row and `MonthEntryRow.tsx`'s delete button
- [x] 3.5 Wire the `completada` toggle to `useUpdateTarea`, independent of entering edit mode (a single click toggles it directly from the collapsed row, not requiring expansion first)

## 4. Manual verification in the browser

- [x] 4.1 Create a task with just a título; confirm it appears in the "Sin fecha" section
- [x] 4.2 Create a task with título, emoji, fecha (past date), hora, and nota; confirm it appears in the dated section, shows the overdue treatment, and shows its emoji
- [x] 4.3 Toggle a task's completada state directly from the list; confirm the overdue treatment disappears immediately for a past-dated task
- [x] 4.4 Edit a task's fecha via the inline accordion; confirm the list re-sorts correctly (including moving between dated/undated sections if fecha is cleared or set)
- [x] 4.5 Delete a task; confirm it's removed from the list
- [x] 4.6 Confirm the emoji picker only offers the fixed task emoji set (no free text), and that the screen, modal, and accordion all render correctly in light/dark mode and on a mobile viewport
- [x] 4.7 Clean up any test tasks created during verification so no orphaned test data remains in the real account
