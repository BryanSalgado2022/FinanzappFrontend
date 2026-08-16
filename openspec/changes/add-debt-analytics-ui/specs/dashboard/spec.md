## MODIFIED Requirements

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

## ADDED Requirements

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
