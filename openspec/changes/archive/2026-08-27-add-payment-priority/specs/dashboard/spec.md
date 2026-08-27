## ADDED Requirements

### Requirement: Payment priority card
The system SHALL display, on the Dashboard above the variable-expenses section, a card highlighting the single most urgent pending `deuda` or `gasto_fijo` entry across all of the user's months — independent of whichever month the Dashboard is currently displaying — where urgency is computed from the entry's due date. An entry qualifies only if it has a `dia_vencimiento` set, is not yet paid, and belongs to a `deuda` or `gasto_fijo` concept — `ingreso` concepts and entries with no due day are never considered.

#### Scenario: Most urgent entry is shown
- **WHEN** the user has one or more qualifying pending entries, in any month
- **THEN** the card shows the name, amount, priority level, and due-date status of the single most urgent one

#### Scenario: Card is unaffected by the Dashboard's month selection
- **WHEN** the user changes which month the Dashboard displays
- **THEN** the payment priority card's highlighted entry does not change, unless changing the month happens to also change which entry is most urgent (e.g. after paying one)

#### Scenario: No qualifying entries
- **WHEN** the user has no qualifying pending entries at all (none exist, all are paid, or none have a due day set)
- **THEN** the card shows an empty/positive state rather than an error, and no "Ver todas" control

#### Scenario: Income concepts are never prioritized
- **WHEN** an `ingreso` concept has a pending, overdue entry
- **THEN** it is never shown by the payment priority card

### Requirement: Priority level is computed from the due date
The system SHALL classify each qualifying entry into exactly one priority level: **Alta** when the entry is overdue, **Media** when its due date is within the next 5 days (inclusive), and **Baja** when its due date is more than 5 days away.

#### Scenario: Overdue entry is Alta
- **WHEN** a qualifying entry's due date has already passed
- **THEN** its priority level is Alta

#### Scenario: Entry due within 5 days is Media
- **WHEN** a qualifying entry's due date is today or within the next 5 days
- **THEN** its priority level is Media

#### Scenario: Entry due later is Baja
- **WHEN** a qualifying entry's due date is more than 5 days away
- **THEN** its priority level is Baja

### Requirement: One-click "Pagar mes" from the priority card
The system SHALL let the user mark the highlighted entry as paid directly from the payment priority card, using its planned amount as the paid amount, without opening an edit form.

#### Scenario: Marking the highlighted entry paid
- **WHEN** the user activates "Pagar mes" on the payment priority card
- **THEN** the entry is marked paid with `monto_pagado` equal to its `monto_planeado`, and the card updates to show the next most urgent qualifying entry (if any)

#### Scenario: Paid amount differs from planned
- **WHEN** the user actually paid a different amount than planned
- **THEN** they can navigate to the concept's detail page from the card to adjust the paid amount there, since the one-click action only covers the exact-planned-amount case

### Requirement: Full priority-ranked list
The system SHALL provide a "Ver todas" control on the payment priority card that opens a list of every qualifying entry across the app (not limited to the selected month's single highlight), ranked by priority level and then by due date within each level.

#### Scenario: Opening the full list
- **WHEN** the user activates "Ver todas"
- **THEN** every qualifying entry is shown, grouped or ordered by priority (Alta first, then Media, then Baja), each entry sorted by soonest due date within its level

#### Scenario: Navigating from the full list
- **WHEN** the user clicks an entry in the full list
- **THEN** the app navigates to that entry's concept detail page
