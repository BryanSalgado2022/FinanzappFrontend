## ADDED Requirements

### Requirement: Due day is editable at any time
The system SHALL let the user set or change a `deuda` or `gasto_fijo` concept's due day from the Concept Detail screen at any time, including on a debt whose amortization terms are locked — unlike those financial terms, the due day is always editable.

#### Scenario: Editing the due day on a locked debt
- **WHEN** the user edits the due day of a debt concept that has amortization terms set
- **THEN** the app accepts the change, even though the concept's financial terms remain locked

#### Scenario: Due day displayed when set
- **WHEN** a concept has a due day set
- **THEN** the Concept Detail header displays it

### Requirement: Overdue monthly entries are visually distinguished
The system SHALL visually distinguish, in the twelve-month entry list, a monthly entry the backend reports as overdue (`vencida`) from one that is merely unpaid, making the overdue state read as more urgent.

#### Scenario: Overdue entry stands out from a pending one
- **WHEN** an unpaid monthly entry is reported as overdue
- **THEN** its visual treatment in the entry list differs from an unpaid entry that is not yet overdue

#### Scenario: Paid entries are never shown as overdue
- **WHEN** a monthly entry is paid
- **THEN** the entry list does not show it with the overdue treatment, regardless of its due date
