# dashboard Specification

## Purpose
Gives the user a single at-a-glance view of a chosen month's financial picture — income, expenses, net balance, and which concepts are paid or still pending — replacing the top rows of their spreadsheet.

## Requirements

### Requirement: Month/year selection
The system SHALL let the authenticated user choose which year and month the Dashboard displays, defaulting to the current calendar month on first load.

#### Scenario: Default month on load
- **WHEN** the Dashboard loads with no month/year previously selected in this session
- **THEN** it displays data for the current calendar year and month

#### Scenario: Changing the selected month
- **WHEN** the user picks a different month/year
- **THEN** the summary cards and concept list both update to reflect the newly selected month

### Requirement: Monthly summary cards
The system SHALL display the selected month's total income, total expenses, and net balance, sourced from the backend's monthly summary.

#### Scenario: Positive balance displayed distinctly
- **WHEN** the selected month's net balance is positive
- **THEN** the Dashboard visually distinguishes it from a negative balance (e.g. so the user can tell at a glance whether they're ahead or behind)

#### Scenario: Month with no data
- **WHEN** the selected month has no income or expense entries at all
- **THEN** the summary cards show zero values rather than an error or a blank state

### Requirement: Current month's concept list with status
The system SHALL list, below the summary cards, the authenticated user's concepts that have an entry for the selected month, each showing its name, type, and whether that month's entry is paid or pending.

#### Scenario: Concept with a pending entry
- **WHEN** a concept's entry for the selected month has not been marked paid
- **THEN** it appears in the list marked as pending, visually distinct from paid entries

#### Scenario: Concept list is scoped to the authenticated user
- **WHEN** the Dashboard loads
- **THEN** it only lists concepts belonging to the authenticated user, never another user's data

### Requirement: Create a new concept from the Dashboard
The system SHALL let the user create a new concept (debt, fixed expense, or income) directly from the Dashboard without navigating to a separate page first. When creating a `deuda`, the user MAY optionally provide amortization terms (an interest rate, whether it is monthly or annual, and a number of installments); once created with these terms, the form SHALL NOT offer to edit them afterward.

#### Scenario: Creating a concept updates the Dashboard
- **WHEN** the user successfully creates a new concept from the Dashboard
- **THEN** the concept list refreshes to include it without requiring a manual page reload

#### Scenario: Creating a debt with amortization terms
- **WHEN** the user creates a `deuda` concept and provides an interest rate (marking whether it's monthly or annual) and a number of installments
- **THEN** the concept is created with those terms, and its monthly entries reflect the resulting fixed installment amount

#### Scenario: Amortization terms remain optional
- **WHEN** the user creates a `deuda` concept without providing an interest rate or installment count
- **THEN** the concept is created exactly as before this change, with no amortization terms

### Requirement: Annual planned-vs-actual trend
The system SHALL display, on the Dashboard, a chart of the selected year's total planned income and total planned expenses across its 12 months.

#### Scenario: Trend reflects the selected year
- **WHEN** the user views the annual trend for a given year
- **THEN** the chart shows one data point per month for that year, including months with no data as zero

### Requirement: Link to the Deudas screen
The system SHALL provide, on the Dashboard, a way to navigate to the aggregate Deudas screen.

#### Scenario: Navigating to Deudas
- **WHEN** the user activates the link/button to the Deudas screen from the Dashboard
- **THEN** the app navigates to the Deudas screen

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
