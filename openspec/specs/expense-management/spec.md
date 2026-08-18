# expense-management Specification

## Purpose
Lets the user record, browse, edit, and delete ad-hoc variable expenses (a specific purchase on a specific day, with no monthly plan behind it) from the app.

## Requirements

### Requirement: Dedicated expenses screen
The system SHALL provide a dedicated screen listing the authenticated user's variable expenses, each showing its amount, date, description, and assigned categories (if any).

#### Scenario: Navigating to the expenses screen
- **WHEN** the user activates the expenses link in the Header
- **THEN** the app navigates to the dedicated expenses screen and lists the user's expenses

#### Scenario: Expenses list is scoped to the authenticated user
- **WHEN** the expenses screen loads
- **THEN** it only lists expenses belonging to the authenticated user, never another user's data

### Requirement: Create a variable expense
The system SHALL let the user create a variable expense by providing an amount, a date, and a description, optionally assigning it one or more of their existing categories via the same category picker used for concepts.

#### Scenario: Creating a minimal expense
- **WHEN** the user submits the expense creation form with only amount, date, and description
- **THEN** the expense is created with no categories assigned, and appears in the expenses list

#### Scenario: Creating an expense updates the balance
- **WHEN** the user successfully creates a variable expense dated in the currently viewed Dashboard month
- **THEN** the Dashboard's total-expenses and balance figures reflect it without a manual page reload

### Requirement: Edit and delete a variable expense
The system SHALL let the user edit any field of their own expense (amount, date, description, categories) or delete it, inline from the expenses list, with no restriction based on the expense's date.

#### Scenario: Editing an expense
- **WHEN** the user edits an expense's amount, date, description, or categories and saves
- **THEN** the expense list reflects the change without navigating away from the expenses screen

#### Scenario: Deleting an expense
- **WHEN** the user deletes an expense
- **THEN** it no longer appears in the expenses list, and any affected Dashboard balance updates without a manual page reload
