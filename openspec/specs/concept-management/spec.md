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
The system SHALL display the concept's monthly entries for a selectable year as a list (not a spreadsheet-style grid), each entry showing its month, planned amount, and paid/pending status, with the current calendar month visually distinguished from past and future months.

#### Scenario: Month with no entry yet
- **WHEN** a given month has no monthly entry recorded for the concept
- **THEN** that month is still shown in the list, indicated as having no planned amount, rather than being omitted

#### Scenario: Viewing a different year
- **WHEN** the user selects a year other than the current one
- **THEN** the list updates to show that year's twelve monthly entries for the concept

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
