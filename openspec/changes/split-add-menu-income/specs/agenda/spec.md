## MODIFIED Requirements

### Requirement: Quick-entry from a calendar day
The system SHALL let the user create a variable expense, task, debt, monthly payment, or income concept directly from a selected calendar day, pre-filling that day's date (or due day, for concepts) into the corresponding existing creation form. Income SHALL be reachable via its own dedicated control, separate from the menu covering variable expense, task, debt, and monthly payment.

#### Scenario: Creating a variable expense from a day
- **WHEN** the user chooses to add a variable expense from a selected day
- **THEN** the expense creation form opens with that day's date already filled in

#### Scenario: Creating a task from a day
- **WHEN** the user chooses to add a task from a selected day
- **THEN** the task creation form opens with that day's date already filled in

#### Scenario: Creating a concept from a day
- **WHEN** the user chooses to add a debt or monthly payment concept from a selected day
- **THEN** the concept creation form opens for the viewed month, with that day pre-filled as the due day

#### Scenario: Creating an income concept from a day
- **WHEN** the user activates the dedicated income control for a selected day
- **THEN** the income concept creation form opens directly for the viewed month, with that day pre-filled as the due day, without an intermediate menu

#### Scenario: Debtors and abonos are not creatable from the Agenda
- **WHEN** the user is choosing what to add from a selected day
- **THEN** creating a new debtor or recording an abono is not offered as an option
