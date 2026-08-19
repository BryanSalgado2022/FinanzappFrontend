## Purpose

Gives the user a floating chat entry point, available from any authenticated screen, to describe a financial action in plain language and have it proposed for their review - never saved automatically - reusing the exact same creation forms' underlying mutations once confirmed.

## ADDED Requirements

### Requirement: Widget is available on every authenticated screen
The system SHALL render a floating chat entry point on every authenticated screen, mounted once in the shared app layout rather than per-page.

#### Scenario: Widget persists across navigation
- **WHEN** the user navigates from one section of the app to another (e.g. Dashboard to Agenda)
- **THEN** the chat widget (and any in-progress conversation) remains available, since it isn't tied to a single page's lifecycle

### Requirement: Conversation state is client-only
The system SHALL keep the chat conversation in memory on the client, and SHALL NOT expect or rely on any server-side persistence of it.

#### Scenario: Reloading the page clears the conversation
- **WHEN** the user reloads the page mid-conversation
- **THEN** the chat widget starts a fresh, empty conversation - no prior messages are recovered

### Requirement: Every message includes the client's current date
The system SHALL include the client's current local date with every message sent to the backend, so relative expressions ("hoy", "ayer") resolve against the user's own clock rather than the server's.

#### Scenario: Relative date resolves to the client's day
- **WHEN** the user sends a message containing a relative date expression
- **THEN** the request to the backend includes today's date as observed by the user's own browser

### Requirement: A proposed action is shown for confirmation, never auto-saved
The system SHALL render a backend-returned proposed action as an editable confirmation card, and SHALL NOT create the corresponding entity until the user explicitly confirms.

#### Scenario: Proposal renders as a review card
- **WHEN** the backend returns a proposed action
- **THEN** the widget shows the entity type and its extracted fields in a card, with no entity created yet

#### Scenario: Fields are editable before confirming
- **WHEN** a proposed action's extracted field is incorrect (e.g. a misread amount)
- **THEN** the user can edit that field's value in the card before confirming

#### Scenario: Confirming creates the entity via the existing mutation
- **WHEN** the user confirms a proposed action
- **THEN** the widget calls the same creation mutation hook the corresponding manual form already uses, with the (possibly edited) fields from the card

#### Scenario: Dismissing a proposal creates nothing
- **WHEN** the user dismisses or cancels a proposed action instead of confirming it
- **THEN** no entity is created, and the conversation can continue

### Requirement: Clarifying questions and replies render as chat messages
The system SHALL render a backend-returned clarifying question or plain reply as a normal chat message, awaiting the user's next input, without any confirmation card.

#### Scenario: Clarifying question awaits an answer
- **WHEN** the backend returns a clarifying question
- **THEN** the widget shows it as a message from the assistant and accepts the user's next message as its answer, continuing the same conversation

### Requirement: A successful confirmation reflects in the rest of the app
The system SHALL ensure that confirming a proposed action updates any already-visible data that depends on it (e.g. the Dashboard's balance, a list of Gastos), through the same cache invalidation the manual creation forms already trigger.

#### Scenario: Dashboard reflects a chat-confirmed expense
- **WHEN** the user confirms a proposed Gasto while the Dashboard is showing the current month
- **THEN** the Dashboard's totals and expense list update the same way they would if the expense had been added through the manual form
