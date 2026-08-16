## ADDED Requirements

### Requirement: Optional due day when creating a debt or fixed expense
The system SHALL let the user optionally provide a due day (an integer from 1 to 28) when creating a `deuda` or `gasto_fijo` concept from the Dashboard, and SHALL NOT offer this field when creating an `ingreso` concept.

#### Scenario: Creating a debt with a due day
- **WHEN** the user creates a `deuda` concept and provides a due day
- **THEN** the concept is created with that due day set

#### Scenario: Due day remains optional
- **WHEN** the user creates a `deuda` or `gasto_fijo` concept without providing a due day
- **THEN** the concept is created exactly as before this change, with no due day set

#### Scenario: No due-day field for income
- **WHEN** the user is creating an `ingreso` concept
- **THEN** the creation form does not offer a due-day field
