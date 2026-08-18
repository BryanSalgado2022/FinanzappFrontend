## MODIFIED Requirements

### Requirement: Concept detail header
The system SHALL display, for a selected concept, its name, type (debt, fixed expense, or income), and the emoji of each assigned category when set.

#### Scenario: Debt concept shows remaining balance
- **WHEN** the selected concept is a debt with a total amount set
- **THEN** the header prominently displays its remaining balance

#### Scenario: Non-debt concept has no balance display
- **WHEN** the selected concept is a fixed expense or income (no total amount)
- **THEN** the header does not display a remaining-balance figure

#### Scenario: Concept with multiple categories shows every emoji
- **WHEN** the selected concept has two or more categories assigned, each with an emoji set
- **THEN** the header shows every one of those emojis, not just one

#### Scenario: Category without an emoji is shown without one
- **WHEN** the selected concept has a category assigned that has no emoji set
- **THEN** the header shows that category without a placeholder emoji

### Requirement: Edit and delete a concept
The system SHALL let the user edit a concept's name and category assignments, mark it as finished, or delete it, from the Concept Detail screen.

#### Scenario: Marking a concept finished
- **WHEN** the user marks a concept as finished
- **THEN** the app reflects its finished status and it no longer appears in the Dashboard's active concept flows

#### Scenario: Deleting a concept
- **WHEN** the user deletes a concept
- **THEN** the app navigates back to the Dashboard and the concept no longer appears there

#### Scenario: Editing a concept's categories
- **WHEN** the user edits a concept and changes its selected categories
- **THEN** the concept's category assignments are updated to exactly the newly selected set

### Requirement: Amortization terms are never editable
The system SHALL NOT offer a way to edit `valor_total`, interest rate, installment count, or starting installment for a debt concept that has amortization terms, consistent with the backend rejecting such changes.

#### Scenario: No edit control for amortization terms
- **WHEN** the user views or edits a debt concept that has amortization terms
- **THEN** the edit form only allows changing its name and category assignments, not its financial terms or starting installment
