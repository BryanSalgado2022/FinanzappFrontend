## Context

See proposal.md - Why, and the sibling backend change's design.md for the exact `POST /agent/chat` contract this consumes: request `{ messages: [{role, content}], current_date }`, response is one of `{type:"proposed_action", entity, fields}` / `{type:"clarification_needed", message}` / `{type:"reply", message}` (entity ∈ `gasto|concepto|tarea|deudor|abono`). `AppShell.tsx` (from the recent collapsible-sidebar change) already mounts `Header`/`Sidebar`/`Outlet` once for every protected route - this is where the widget mounts too, so it doesn't need its own routing or per-page wiring. Existing mutation hooks already do exactly what's needed post-confirmation: `useCreateGasto`, `useCreateConcept`, `useCreateTarea`, `useCreateDeudor`, `useCreateAbono` (all in their respective `src/hooks/use*.ts`), each already invalidating the right TanStack Query cache keys on success - see `useCreateGasto`'s example, which invalidates both `['gastos']` and `['summary']`.

## Goals / Non-Goals

**Goals:**
- Confirming a proposal in the chat is indistinguishable, data-wise, from submitting the equivalent manual form - same hook, same cache invalidation, no parallel write path.
- The widget never blocks the rest of the app - it's an overlay, not a route; the user can still use every other screen with it open or closed.

**Non-Goals:**
- Not persisting or syncing conversations across devices/reloads - see proposal.md.
- Not building a generic chat component library - this widget is purpose-built for this one conversation shape (three response types, one confirmation-card pattern).
- Not adding category assignment to the confirmation card - matches the backend's v1 scope (no `categoria_ids` in any tool).

## Decisions

**Widget owns its own local state, no new global context.** A single `AgentChatWidget` component holds `messages: ChatMessage[]`, `open: boolean`, and whatever's needed for the in-flight request/response - all local `useState`, no new React Context. Nothing outside the widget needs to read its state (unlike the sidebar's collapsed/expanded state, which `AppShell`'s content wrapper needs to react to for the margin offset - this has no equivalent here).

**One hook, `useAgentChat`, wraps the raw fetch.** `src/hooks/useAgentChat.ts` exposes a `sendMessage(text: string)` that appends the user message to local history, POSTs the full history + `current_date` (via the existing `apiClient` from `src/lib/apiClient.ts`, same pattern as every other hook - `apiClient.post<ChatResponse>('/agent/chat', body)`), and returns the discriminated response. Implemented as a plain function + local state inside the widget rather than a `useMutation`, since there's no cache to invalidate for the chat call itself (only the *confirmation* step invalidates caches, via the entity's own existing hook).

**Confirmation card maps `entity` to the right hook and field editor at one call site.** A small lookup (entity → { hook, fields-to-render }) inside the confirmation card component, e.g.:
```ts
const ENTITY_HOOKS = {
  gasto: useCreateGasto,
  concepto: useCreateConcept,
  tarea: useCreateTarea,
  deudor: useCreateDeudor,
  // abono needs a deudor id, already resolved server-side into `fields.deudor_id`
  abono: (deudorId: number) => useCreateAbono(deudorId),
}
```
*Alternative considered*: a generic "call this REST path with this body" approach bypassing the hooks entirely. Rejected - it would skip the cache invalidation the hooks already provide, directly contradicting the "Dashboard reflects a chat-confirmed expense" requirement.

**Field editing**: simple controlled inputs per field, typed loosely (strings for amounts/dates, matching how the existing forms already handle `MoneyInput`/`<input type="date">`) - reuse `MoneyInput` from `src/components/MoneyInput.tsx` where a proposed field is a monetary amount, for visual and behavioral consistency with every other form in the app.

**Placement and visual language**: fixed-position bubble (bottom-right, `fixed bottom-5 right-5 z-30` or similar - above page content, below the mobile sidebar's overlay z-index so the sidebar can still cover it if both are open) that expands into a panel; same `bg-paper-raised`/`border-line`/`rounded-*` shell language already used by `AccentColorPicker` and `EventDetailPopover`, keeping the "editorial ledger" system consistent rather than inventing a new chat-specific visual style.

## Risks / Trade-offs

[A long conversation resent in full on every message grows the request payload over time] → Acceptable at this scale (a quick back-and-forth to register one action, not a long-running chat) - if it ever becomes a problem, trimming old messages client-side is a small follow-up, not a redesign.
[The confirmation card's per-entity field editor needs to stay in sync with each `*Create` schema if those schemas change] → Same coupling any form already has to its schema; no new risk category, just one more place that mirrors the backend contract.
