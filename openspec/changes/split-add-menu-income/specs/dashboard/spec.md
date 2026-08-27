## ADDED Requirements

### Requirement: Income has a dedicated one-click entry point
The system SHALL provide a separate "+ Agregar ingreso" control on the Dashboard, distinct from the control used for debts/fixed-expenses/variable-expenses, that opens the income concept creation form directly without an intermediate menu.

#### Scenario: Creating an income concept
- **WHEN** the user activates "+ Agregar ingreso"
- **THEN** the concept creation form opens immediately with `ingreso` as the type, without showing a menu of other options first

#### Scenario: Other creation options remain grouped separately
- **WHEN** the user activates the other "+ Agregar" control
- **THEN** it shows the existing menu of Deuda, Pago mensual, and Gasto puntual, without Ingreso listed among them
