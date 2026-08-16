# debts-screen Specification

## Purpose
Gives the user one place to see how they're doing across all their debts at once — total owed, total paid, overall progress, and how each debt compares to the others — instead of only seeing one debt at a time.

## Requirements

### Requirement: Aggregate debt totals
The system SHALL display, on the Deudas screen, the user's total amount owed, total amount paid, and overall percent progress across all their debts.

#### Scenario: Totals reflect all debts
- **WHEN** the Deudas screen loads
- **THEN** the displayed totals match the sum across every debt the user has, not just one

#### Scenario: No debts yet
- **WHEN** the user has no debt concepts
- **THEN** the screen shows zero totals and an empty/prompt state rather than an error

### Requirement: Debt composition chart
The system SHALL display a chart showing each debt's share of the user's total remaining debt.

#### Scenario: Composition updates as debts are added
- **WHEN** the user has more than one debt
- **THEN** the composition chart shows each debt's proportional share

### Requirement: Per-debt progress list
The system SHALL list each of the user's debts with its own remaining balance and progress, and let the user navigate from a list entry to that debt's Concept Detail screen.

#### Scenario: Selecting a debt navigates to its detail
- **WHEN** the user selects a debt from the list on the Deudas screen
- **THEN** the app navigates to that debt's Concept Detail screen
