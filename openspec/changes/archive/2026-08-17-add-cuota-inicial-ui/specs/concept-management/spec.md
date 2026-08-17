## MODIFIED Requirements

### Requirement: Amortization terms display
The system SHALL display, in the Concept Detail header for a debt concept that has amortization terms, its fixed installment amount, interest rate, and number of installments, alongside the existing remaining-balance display. When the concept has a starting installment other than the first, the system SHALL also display that starting installment.

#### Scenario: Amortized debt shows its fixed installment
- **WHEN** the selected concept is a debt with amortization terms
- **THEN** the header shows the fixed installment amount together with the remaining balance

#### Scenario: Non-amortized debt is unaffected
- **WHEN** the selected concept is a debt without amortization terms
- **THEN** the header shows only the remaining balance, exactly as before this change

#### Scenario: Starting installment is shown when set
- **WHEN** the selected concept is a debt with amortization terms and a starting installment greater than 1
- **THEN** the header indicates which installment the schedule started at

#### Scenario: Starting installment is omitted when not set
- **WHEN** the selected concept is a debt with amortization terms and no starting installment set
- **THEN** the header does not display any starting-installment information, exactly as before this change

### Requirement: Amortization terms are never editable
The system SHALL NOT offer a way to edit `valor_total`, interest rate, installment count, or starting installment for a debt concept that has amortization terms, consistent with the backend rejecting such changes.

#### Scenario: No edit control for amortization terms
- **WHEN** the user views or edits a debt concept that has amortization terms
- **THEN** the edit form only allows changing its name and category, not its financial terms or starting installment
