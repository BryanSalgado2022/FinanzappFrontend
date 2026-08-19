## MODIFIED Requirements

### Requirement: Due day is editable at any time
The system SHALL let the user set or change any concept's due day from the Concept Detail screen at any time, including on a debt whose amortization terms are locked — unlike those financial terms, the due day is always editable. For an `ingreso` concept, the field SHALL be labeled as the day it's expected to be received, not as a "due" day.

#### Scenario: Editing the due day on a locked debt
- **WHEN** the user edits the due day of a debt concept that has amortization terms set
- **THEN** the app accepts the change, even though the concept's financial terms remain locked

#### Scenario: Due day displayed when set
- **WHEN** a concept has a due day set
- **THEN** the Concept Detail header displays it

#### Scenario: Income concepts can have a payment day
- **WHEN** the user sets a day on an `ingreso` concept
- **THEN** the app accepts it and displays it with wording appropriate to income (e.g. "Día de pago"), not the "vencimiento" (due) wording used for `deuda`/`gasto_fijo`
