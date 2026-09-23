## ADDED Requirements

### Requirement: Route a payment surplus into a principal prepayment when marking a monthly entry paid
The system SHALL, for a monthly entry belonging to an amortized debt, show an inline choice between `reducir_plazo` and `reducir_cuota` when the entered paid amount exceeds the entry's planned amount, and route the surplus into a principal prepayment per that choice on save, without a separate confirmation step. Non-amortized debts and non-debt concepts (`gasto_fijo`, `ingreso`) are unaffected.

#### Scenario: A surplus reveals the modo choice on an amortized debt
- **WHEN** a user editing a monthly entry for an amortized debt enters a paid amount exceeding the planned amount
- **THEN** an inline "Reducir plazo"/"Reducir cuota" choice appears, defaulting to "Reducir cuota"

#### Scenario: Saving a surplus routes it without extra confirmation
- **WHEN** a user picks a modo and saves
- **THEN** the request is sent immediately, with no separate confirmation step

#### Scenario: No surplus toggle on non-debt concepts
- **WHEN** a user enters a paid amount exceeding the planned amount on a `gasto_fijo` or `ingreso` entry
- **THEN** no modo choice appears, and the entry is saved exactly as before this change

#### Scenario: No surplus toggle on a non-amortized debt
- **WHEN** a user enters a paid amount exceeding the planned amount on a debt concept with no amortization terms
- **THEN** no modo choice appears, and the entry is saved exactly as before this change
