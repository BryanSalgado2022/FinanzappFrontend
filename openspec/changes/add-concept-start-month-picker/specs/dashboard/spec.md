## MODIFIED Requirements

### Requirement: Create a new concept from the Dashboard
The system SHALL let the user create a new concept (debt, fixed expense, or income) directly from the Dashboard without navigating to a separate page first. When creating a `deuda`, the user MAY optionally provide amortization terms (an interest rate, whether it is monthly or annual, and a number of installments); once created with these terms, the form SHALL NOT offer to edit them afterward. The interest-rate field SHALL make clear, through an example and persistent guidance text, that the value is entered as a plain percentage (e.g. "27.7" for 27.7%), not a fraction. The user MAY optionally assign zero or more categories to the concept, choosing from their existing categories or typing a new name to create one on the fly. For any concept type, the user MAY optionally choose a different starting month/year than the one currently displayed on the containing screen, via a control hidden by default; when not activated, the concept is created for the containing screen's currently displayed month/year, exactly as before this change.

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

#### Scenario: Assigning existing categories at creation
- **WHEN** the user selects one or more of their existing categories while creating a concept
- **THEN** the concept is created with exactly those categories assigned

#### Scenario: Creating a new category inline while creating a concept
- **WHEN** the user types a name that does not match any existing category while creating a concept
- **THEN** a new category with that name is created and assigned to the concept, with no emoji set

#### Scenario: Categories remain optional at creation
- **WHEN** the user creates a concept without selecting or typing any category
- **THEN** the concept is created with no categories assigned, exactly as before this change

#### Scenario: Starting month/year picker is hidden by default
- **WHEN** the user opens the new-concept form
- **THEN** no month/year picker is shown, and the form behaves exactly as before this change

#### Scenario: Choosing a future starting month from the Dashboard
- **WHEN** the user activates the "start in a different month" control and selects a future month/year, then creates the concept
- **THEN** the concept's first monthly entry is created for that selected month/year, not the Dashboard's currently displayed month

#### Scenario: Picker is available for every concept type
- **WHEN** the user is creating a `deuda`, `gasto_fijo`, or `ingreso` concept
- **THEN** the "start in a different month" control is available regardless of which type is selected
