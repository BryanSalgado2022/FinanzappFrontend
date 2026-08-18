## MODIFIED Requirements

### Requirement: Monthly summary cards
The system SHALL display the selected month's total income, total expenses, and net balance, sourced from the backend's monthly summary, where total expenses includes both planned debt/fixed-expense amounts and the month's variable expenses.

#### Scenario: Positive balance displayed distinctly
- **WHEN** the selected month's net balance is positive
- **THEN** the Dashboard visually distinguishes it from a negative balance (e.g. so the user can tell at a glance whether they're ahead or behind)

#### Scenario: Month with no data
- **WHEN** the selected month has no income or expense entries at all
- **THEN** the summary cards show zero values rather than an error or a blank state

## ADDED Requirements

### Requirement: Record a variable expense from the Dashboard
The system SHALL let the user create a variable expense directly from the Dashboard without navigating to a separate page first, via a quick-entry control that is visually distinct from the existing "new concept" control.

#### Scenario: Quick-entry control is distinguishable from concept creation
- **WHEN** the user views the Dashboard
- **THEN** the control for recording a variable expense is visually distinct (different label and/or icon) from the control for creating a new concept, so the two actions are not mistaken for each other

#### Scenario: Recording an expense updates the Dashboard
- **WHEN** the user successfully records a variable expense from the Dashboard
- **THEN** the variable-expenses summary section and the summary cards refresh to reflect it without a manual page reload

### Requirement: Variable expenses summary section
The system SHALL display, on the Dashboard, a summary section listing the selected month's most recent variable expenses.

#### Scenario: Section reflects the selected month
- **WHEN** the user changes the Dashboard's selected month
- **THEN** the variable-expenses summary section updates to show that month's expenses

#### Scenario: No variable expenses yet
- **WHEN** the selected month has no variable expenses recorded
- **THEN** the section shows an empty state rather than an error or a blank gap
