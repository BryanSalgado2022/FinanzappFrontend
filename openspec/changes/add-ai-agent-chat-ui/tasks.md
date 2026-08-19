## 1. Types and hook

- [x] 1.1 `src/types.ts`: `ChatMessage`, `ChatRequest`, and the discriminated `ChatResponse` union (`proposed_action` / `clarification_needed` / `reply`), matching the backend's exact shape
- [x] 1.2 `src/hooks/useAgentChat.ts`: `sendMessage(text)` - appends to local history, POSTs `/agent/chat` with full history + client's current date, returns the response

## 2. Confirmation card

- [x] 2.1 `src/components/AgentProposedActionCard.tsx` (or similar): renders a proposed action's fields editable per entity type, reusing `MoneyInput` for monetary fields
- [x] 2.2 Entity → hook lookup (gasto/concepto/tarea/deudor/abono → their respective `useCreate*` hooks)
- [x] 2.3 Confirm button calls the resolved hook's mutation with the (possibly edited) fields; on success, closes the card and shows a confirmation message in the chat; on error, shows the failure inline without losing the edited fields
- [x] 2.4 Cancel/dismiss button clears the card without creating anything

## 3. Chat widget

- [x] 3.1 `src/components/AgentChatWidget.tsx`: floating bubble (closed state) that expands to a panel (open state), local `messages`/`open` state
- [x] 3.2 Message list rendering: user messages, plain assistant replies/clarifying questions as text, proposed actions as the confirmation card from Group 2
- [x] 3.3 Text input + send, wired to `useAgentChat`'s `sendMessage`
- [x] 3.4 Loading state while waiting for the backend response; error state if the request fails (mirrors the backend's distinct error response from a normal chat reply)

## 4. Mount in AppShell

- [x] 4.1 `src/components/AppShell.tsx`: mount `AgentChatWidget` once, alongside `Header`/`Sidebar`/`Outlet`
- [x] 4.2 `npx tsc -b` clean

## 5. Manual verification

- [ ] 5.1 Send "Hoy gasté 50.000 en gasolina para el carro" - confirm a Gasto proposal card appears with the right monto/fecha/descripcion, confirm it, verify it appears in `/gastos` and the Dashboard's totals update
- [ ] 5.2 Send the mortgage debt example - confirm a Concepto (deuda) proposal card with amortization fields, confirm it, verify it appears in `/deudas`
- [ ] 5.3 Send an incomplete message, confirm the widget shows the clarifying question as a chat message (not a card), reply to it, confirm the follow-up produces a proper proposal
- [ ] 5.4 Register an abono for an existing debtor by name, confirm the proposal resolves to the right debtor
- [ ] 5.5 Try an abono for a nonexistent debtor name, confirm a clarifying question instead of a broken proposal
- [ ] 5.6 Edit a field in a proposal card before confirming, verify the edited value (not the original) is what gets saved
- [ ] 5.7 Dismiss a proposal without confirming, verify nothing was created
- [x] 5.8 Confirm the widget is present and usable from at least two different screens (e.g. Dashboard and Agenda) without losing its in-progress conversation when navigating between them
- [x] 5.9 Check the widget and confirmation card in both dark and light mode
- [x] 5.10 Check the widget doesn't visually collide with the mobile sidebar overlay or the Agenda's own "+ Agregar" floating control on a narrow viewport
