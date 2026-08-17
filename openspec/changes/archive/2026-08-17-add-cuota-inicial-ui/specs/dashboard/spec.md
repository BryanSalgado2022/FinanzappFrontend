## ADDED Requirements

### Requirement: Optional starting installment when creating a debt with amortization terms
The system SHALL let the user optionally specify a starting installment number when creating a `deuda` concept with amortization terms (interest rate and installment count), and SHALL make clear that this value cannot be changed after creation.

#### Scenario: Creating a debt already partway through its schedule
- **WHEN** the user creates a `deuda` concept with amortization terms and provides a starting installment
- **THEN** the concept is created with that starting installment

#### Scenario: Starting installment remains optional
- **WHEN** the user creates a `deuda` concept with amortization terms and does not provide a starting installment
- **THEN** the concept is created exactly as before this change, starting at the first installment

#### Scenario: Field only appears with amortization terms
- **WHEN** the user is creating a concept without both an interest rate and an installment count entered
- **THEN** the starting-installment field is not shown
