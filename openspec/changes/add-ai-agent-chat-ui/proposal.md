## Why

Sibling to `add-ai-agent-chat` in FinanzappBackend, which adds `POST /agent/chat`: a stateless endpoint that turns a natural-language message into a proposed action (or a clarifying question, or a plain reply) but never writes anything itself. This change builds the UI half - the floating chat widget the user talks to, and the confirmation step that actually creates the entity, by calling the exact same mutation hooks the regular forms already use.

## What Changes

- A floating chat widget (bubble in a fixed corner, expands to a chat panel), available on every authenticated screen via `AppShell` - not a dedicated route.
- Conversation history lives in React state only, reset on page reload (no persistence) - the widget resends the full history to the backend on every message, along with the client's current date for relative-date resolution ("hoy", "ayer").
- When the backend returns a `proposed_action`, the widget renders an editable confirmation card (entity type + extracted fields, each editable before submitting) instead of auto-saving. Confirming calls the same TanStack Query mutation hook the corresponding form already uses (`useCreateGasto`, `useCreateConcept`, `useCreateTarea`, `useCreateDeudor`, `useCreateAbono`) - zero duplicated write logic, and the same cache invalidation already wired into those hooks fires automatically.
- When the backend returns `clarification_needed` or `reply`, the widget just renders it as a chat message and waits for the next user input.
- No new backend calls beyond the one new `POST /agent/chat` endpoint and the entity-creation endpoints that already exist and are already wired to hooks.

## Capabilities

### New Capabilities
- `agent-chat-ui`: a floating conversational widget that proposes financial actions from natural language and only creates them after explicit user confirmation.

### Modified Capabilities
(none - `AppShell` gains a new persistent child component, but its own existing behavior around the sidebar/header is untouched)

## Impact

- New: `src/components/AgentChatWidget.tsx` (or similar), `src/hooks/useAgentChat.ts`, a small chat-message-list subcomponent, a proposed-action confirmation card subcomponent.
- `src/components/AppShell.tsx`: mounts the widget once, alongside `Header`/`Sidebar`/`Outlet`.
- `src/types.ts`: types matching the backend's `ChatRequest`/response union.
- `.env.example`: no new variables - the widget talks to the existing backend base URL, no direct external API calls from the browser.
