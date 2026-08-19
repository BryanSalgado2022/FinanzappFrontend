## MODIFIED Requirements

### Requirement: Optional due day when creating a debt or fixed expense
The system SHALL let the user optionally provide a due day (an integer from 1 to 28) when creating a `deuda`, `gasto_fijo`, or `ingreso` concept from the Dashboard. For `ingreso`, the field SHALL be labeled as the day it's expected to be received, not as a "due" day.

#### Scenario: Creating a debt with a due day
- **WHEN** the user creates a `deuda` concept and provides a due day
- **THEN** the concept is created with that due day set

#### Scenario: Due day remains optional
- **WHEN** the user creates a `deuda`, `gasto_fijo`, or `ingreso` concept without providing a due day
- **THEN** the concept is created exactly as before this change, with no due day set

#### Scenario: No due-day field for income
- **WHEN** the user creates an `ingreso` concept and provides a day
- **THEN** the concept is created with that day set, and the field is labeled appropriately for income (e.g. "Día de pago"), not "vencimiento"
