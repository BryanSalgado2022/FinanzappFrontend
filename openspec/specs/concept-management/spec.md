# concept-management Specification

## Purpose
Lets the user see and manage everything about one financial concept in one place — what it is, how much of a debt is left to pay, and the month-by-month plan — so tracking a single debt or bill over the year replaces flipping between spreadsheet columns.

## Requirements

### Requirement: Concept detail header
The system SHALL display, for a selected concept, its name, type (debt, fixed expense, or income), and category when set.

#### Scenario: Debt concept shows remaining balance
- **WHEN** the selected concept is a debt with a total amount set
- **THEN** the header prominently displays its remaining balance

#### Scenario: Non-debt concept has no balance display
- **WHEN** the selected concept is a fixed expense or income (no total amount)
- **THEN** the header does not display a remaining-balance figure

### Requirement: Twelve-month entry list
The system SHALL display the concept's monthly entries for a selectable year as a list (not a spreadsheet-style grid), each entry showing its month, planned amount, and paid/pending status, with the current calendar month visually distinguished from past and future months. When the selected year is the current calendar year, months that have already passed SHALL be collapsed behind a single control by default, while the current month and future months SHALL always be shown in full; when the selected year is not the current calendar year, all twelve months SHALL be shown in full regardless of the collapse default.

#### Scenario: Month with no entry yet
- **WHEN** a given month has no monthly entry recorded for the concept
- **THEN** that month is still shown in the list, indicated as having no planned amount, rather than being omitted

#### Scenario: Viewing a different year
- **WHEN** the user selects a year other than the current one
- **THEN** the list updates to show that year's twelve monthly entries for the concept

#### Scenario: Past months of the current year are collapsed by default
- **WHEN** the user opens the current year's entry list and it contains one or more months that have already passed
- **THEN** those past months are hidden behind a single control, while the current month and any future months are shown

#### Scenario: Expanding reveals past months
- **WHEN** the user activates the "show past months" control
- **THEN** the previously hidden past months of the current year become visible in the list

#### Scenario: A past year is never collapsed
- **WHEN** the user navigates to a year before the current calendar year
- **THEN** all twelve months of that year are shown in full, with no collapse control

### Requirement: Edit a month's planned and paid amounts
The system SHALL let the user edit a specific month's planned amount, and separately record and edit the paid amount and paid status, directly from the entry list.

#### Scenario: Recording a payment that differs from the plan
- **WHEN** the user marks a month as paid with a different amount than what was planned
- **THEN** the app saves both the planned and paid amounts independently, and the list reflects the updated paid status

#### Scenario: Editing does not require leaving the screen
- **WHEN** the user edits a month's entry
- **THEN** the change is submitted and reflected without navigating away from the Concept Detail screen

### Requirement: Edit and delete a concept
The system SHALL let the user edit a concept's name and category, mark it as finished, or delete it, from the Concept Detail screen.

#### Scenario: Marking a concept finished
- **WHEN** the user marks a concept as finished
- **THEN** the app reflects its finished status and it no longer appears in the Dashboard's active concept flows

#### Scenario: Deleting a concept
- **WHEN** the user deletes a concept
- **THEN** the app navigates back to the Dashboard and the concept no longer appears there

### Requirement: Amortization terms display
The system SHALL display, in the Concept Detail header for a debt concept that has amortization terms, its fixed installment amount, interest rate, and number of installments, alongside the existing remaining-balance display.

#### Scenario: Amortized debt shows its fixed installment
- **WHEN** the selected concept is a debt with amortization terms
- **THEN** the header shows the fixed installment amount together with the remaining balance

#### Scenario: Non-amortized debt is unaffected
- **WHEN** the selected concept is a debt without amortization terms
- **THEN** the header shows only the remaining balance, exactly as before this change

### Requirement: Amortization terms are never editable
The system SHALL NOT offer a way to edit `valor_total`, interest rate, or installment count for a debt concept that has amortization terms, consistent with the backend rejecting such changes.

#### Scenario: No edit control for amortization terms
- **WHEN** the user views or edits a debt concept that has amortization terms
- **THEN** the edit form only allows changing its name and category, not its financial terms

### Requirement: Due day is editable at any time
The system SHALL let the user set or change a `deuda` or `gasto_fijo` concept's due day from the Concept Detail screen at any time, including on a debt whose amortization terms are locked — unlike those financial terms, the due day is always editable.

#### Scenario: Editing the due day on a locked debt
- **WHEN** the user edits the due day of a debt concept that has amortization terms set
- **THEN** the app accepts the change, even though the concept's financial terms remain locked

#### Scenario: Due day displayed when set
- **WHEN** a concept has a due day set
- **THEN** the Concept Detail header displays it

### Requirement: Overdue monthly entries are visually distinguished
The system SHALL visually distinguish, in the twelve-month entry list, a monthly entry the backend reports as overdue (`vencida`) from one that is merely unpaid, making the overdue state read as more urgent.

#### Scenario: Overdue entry stands out from a pending one
- **WHEN** an unpaid monthly entry is reported as overdue
- **THEN** its visual treatment in the entry list differs from an unpaid entry that is not yet overdue

#### Scenario: Paid entries are never shown as overdue
- **WHEN** a monthly entry is paid
- **THEN** the entry list does not show it with the overdue treatment, regardless of its due date

### Requirement: Year navigation is bounded by the concept's creation date
The system SHALL prevent navigating the year selector to a year before the concept's creation year, and SHALL NOT bound navigation toward future years.

#### Scenario: Cannot navigate before the concept's creation year
- **WHEN** the selected year equals the concept's creation year
- **THEN** the control for navigating to an earlier year has no effect

#### Scenario: Future navigation remains unbounded
- **WHEN** the user navigates the year selector forward
- **THEN** there is no upper limit on how many years ahead the user can navigate
