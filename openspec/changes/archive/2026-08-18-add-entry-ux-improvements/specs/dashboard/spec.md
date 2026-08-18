## MODIFIED Requirements

### Requirement: Create a new concept from the Dashboard
The system SHALL let the user create a new concept (debt, fixed expense, or income) directly from the Dashboard without navigating to a separate page first. When creating a `deuda`, the user MAY optionally provide amortization terms (an interest rate, whether it is monthly or annual, and a number of installments); once created with these terms, the form SHALL NOT offer to edit them afterward. The interest-rate field SHALL make clear, through an example and persistent guidance text, that the value is entered as a plain percentage (e.g. "27.7" for 27.7%), not a fraction.

#### Scenario: Creating a concept updates the Dashboard
- **WHEN** the user successfully creates a new concept from the Dashboard
- **THEN** the concept list refreshes to include it without requiring a manual page reload

#### Scenario: Creating a debt with amortization terms
- **WHEN** the user creates a `deuda` concept and provides an interest rate (marking whether it's monthly or annual) and a number of installments
- **THEN** the concept is created with those terms, and its monthly entries reflect the resulting fixed installment amount

#### Scenario: Amortization terms remain optional
- **WHEN** the user creates a `deuda` concept without providing an interest rate or installment count
- **THEN** the concept is created exactly as before this change, with no amortization terms

#### Scenario: Interest-rate field shows how to enter the value
- **WHEN** the user views the interest-rate field while creating a `deuda` concept
- **THEN** the field shows a concrete percentage example and a persistent helper text clarifying that the number is typed as a percentage, not a decimal fraction
