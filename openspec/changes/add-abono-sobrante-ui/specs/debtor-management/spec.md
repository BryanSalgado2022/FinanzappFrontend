## ADDED Requirements

### Requirement: Route a payment surplus into a principal prepayment when marking an installment paid
The system SHALL let a user enter the actual amount paid when marking a debtor's installment paid. When the entered amount exceeds the installment's planned amount, the system SHALL show an inline choice between `reducir_plazo` and `reducir_cuota` and, on save, route the surplus into a principal prepayment per that choice in the same request, without a separate confirmation step.

#### Scenario: Entering an amount expands into an editable row
- **WHEN** a user opens an installment in the schedule to mark it paid
- **THEN** the row expands into a form with an editable amount field, mirroring the monthly-entry editing pattern

#### Scenario: A surplus reveals the modo choice
- **WHEN** the entered amount exceeds the installment's planned amount
- **THEN** an inline "Reducir plazo"/"Reducir cuota" choice appears, defaulting to "Reducir cuota"

#### Scenario: Saving a surplus routes it without extra confirmation
- **WHEN** a user picks a modo and saves
- **THEN** the request is sent immediately, with no separate confirmation step

#### Scenario: No surplus, no mode sent
- **WHEN** the entered amount does not exceed the planned amount
- **THEN** the request is sent without an `abono_capital_modo`, preserving today's behavior exactly
