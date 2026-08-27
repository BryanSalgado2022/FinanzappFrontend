## MODIFIED Requirements

### Requirement: Monthly summary cards
The system SHALL display the selected month's total income, total expenses, and net balance, sourced from the backend's monthly summary, where total expenses includes both planned debt/fixed-expense amounts and the month's variable expenses. The balance card SHALL be clickable, opening a breakdown of the selected month's contributors to that balance.

#### Scenario: Positive balance displayed distinctly
- **WHEN** the selected month's net balance is positive
- **THEN** the Dashboard visually distinguishes it from a negative balance (e.g. so the user can tell at a glance whether they're ahead or behind)

#### Scenario: Month with no data
- **WHEN** the selected month has no income or expense entries at all
- **THEN** the summary cards show zero values rather than an error or a blank state

#### Scenario: Opening the balance breakdown
- **WHEN** the user clicks the balance card
- **THEN** a breakdown opens listing every concept entry and variable expense contributing to the selected month's balance, sorted by amount descending, with income and expenses visually separated

#### Scenario: Breakdown reflects the selected month only
- **WHEN** the user opens the balance breakdown
- **THEN** it shows only the currently selected month's contributors, not an annual aggregate

#### Scenario: Empty month shows an empty breakdown
- **WHEN** the user opens the balance breakdown for a month with no concept entries and no variable expenses
- **THEN** the breakdown shows an empty state rather than an error

#### Scenario: Navigating from a concept row
- **WHEN** the user clicks a concept's row in the breakdown
- **THEN** the app navigates to that concept's Concept Detail page

#### Scenario: Navigating from an expense row
- **WHEN** the user clicks a variable expense's row in the breakdown
- **THEN** the app navigates to the Gastos screen, where editing that expense is already possible
