## Purpose

Gives the user a single calendar view of everything with a date across the app - debt/income due days, variable expenses, tasks, and debtor activity - browsable by day, with quick-entry and a special marker celebrating a debt paid off, replacing the need to check five separate screens to know what's happening when.

## ADDED Requirements

### Requirement: Dedicated Agenda screen
The system SHALL provide a dedicated Agenda screen, reachable from the Sidebar, showing a full month-grid calendar for a selected year and month.

#### Scenario: Navigating to the Agenda
- **WHEN** the user activates the Agenda link in the Sidebar
- **THEN** the app navigates to the Agenda screen and shows the current calendar month by default

#### Scenario: Month and year navigation
- **WHEN** the user navigates to the previous or next month, or selects a different year
- **THEN** the calendar updates to show that month, and its events reload

### Requirement: Calendar days show which categories of event occurred
The system SHALL mark each day in the grid that has at least one event, distinguishing which categories are present (debt/income due day, variable expense, task, debtor activity) via a legend.

#### Scenario: A day with events is visually marked
- **WHEN** a day in the viewed month has one or more events
- **THEN** the calendar marks that day, indicating which categories are present

#### Scenario: A day with no events shows no marker
- **WHEN** a day has no events of any kind
- **THEN** the calendar shows it as a plain, unmarked day

### Requirement: Every dated record in the app can appear as an Agenda event
The system SHALL include, among the Agenda's events for the viewed month, every one of the following that applies: a `deuda`/`gasto_fijo`/`ingreso` concept's due day (only when set, for that concept's monthly entry, shown regardless of paid status with a distinct visual treatment for paid vs. unpaid), a variable expense's date, a task's date (when set), a debtor's loan-start date, and each of a debtor's recorded abono dates.

#### Scenario: A concept's due day appears when set
- **WHEN** an active concept has a due day set and has a monthly entry for the viewed month
- **THEN** its due day appears as an event on that day, regardless of whether it was already paid

#### Scenario: A concept without a due day does not appear by day
- **WHEN** a concept has no due day set
- **THEN** it does not appear as a day-specific Agenda event, even though it still exists in Conceptos

#### Scenario: Paid and unpaid due-day events are visually distinguished
- **WHEN** the user views a due-day event for an entry that has been marked paid
- **THEN** it is visually distinguished from an unpaid due-day event

#### Scenario: A variable expense always appears
- **WHEN** the viewed month has a variable expense
- **THEN** it appears as an event on its exact date

#### Scenario: A task appears only if it has a date
- **WHEN** a task has a date set in the viewed month
- **THEN** it appears as an event on that date
- **WHEN** a task has no date set
- **THEN** it does not appear anywhere on the Agenda

#### Scenario: A debtor's loan start and each abono appear as distinct events
- **WHEN** a debtor was registered in the viewed month, or received one or more abonos in the viewed month
- **THEN** the loan-start date appears as one event, and each abono appears as its own separate event on its own date, distinguishable from each other

### Requirement: Paid-off debts are celebrated on the Agenda
The system SHALL mark, with a distinct visual treatment from a normal event, any day on which a debt (a `deuda` concept or a debtor) reaches a zero remaining balance via a payment, or is manually closed - whichever applies, and both can apply on different days for the same debt.

#### Scenario: The payment that zeroes a debt's balance is celebrated
- **WHEN** a `deuda` concept's remaining balance is zero and a specific paid monthly entry is the most recently paid one for that concept
- **THEN** that entry's paid date is marked with the celebratory treatment

#### Scenario: The abono that zeroes a debtor's balance is celebrated
- **WHEN** a debtor's remaining balance is zero and a specific abono is the most recently dated one for that debtor
- **THEN** that abono's date is marked with the celebratory treatment

#### Scenario: Manually closing a debt is celebrated on its own day
- **WHEN** a `deuda` concept or a debtor is marked finished/closed
- **THEN** the day it was closed is marked with the celebratory treatment, independent of whether its balance reached zero that same day

### Requirement: Day-level event browsing
The system SHALL let the user select a day in the calendar to see a list of that day's events, and select an event from that list to see its detail.

#### Scenario: Selecting a day shows its event list
- **WHEN** the user selects a day that has one or more events
- **THEN** the app shows a list of that day's events below the calendar

#### Scenario: Selecting an event shows its detail
- **WHEN** the user selects an event from a day's event list
- **THEN** the app shows that event's detail, including a way to navigate to its full screen

#### Scenario: Selecting an empty day
- **WHEN** the user selects a day with no events
- **THEN** the app shows that day's event list as empty, without an error

### Requirement: Quick-entry from a calendar day
The system SHALL let the user create a variable expense, task, debt, monthly payment, or income concept directly from a selected calendar day, pre-filling that day's date (or due day, for concepts) into the corresponding existing creation form.

#### Scenario: Creating a variable expense from a day
- **WHEN** the user chooses to add a variable expense from a selected day
- **THEN** the expense creation form opens with that day's date already filled in

#### Scenario: Creating a task from a day
- **WHEN** the user chooses to add a task from a selected day
- **THEN** the task creation form opens with that day's date already filled in

#### Scenario: Creating a concept from a day
- **WHEN** the user chooses to add a debt, monthly payment, or income concept from a selected day
- **THEN** the concept creation form opens for the viewed month, with that day pre-filled as the due day

#### Scenario: Debtors and abonos are not creatable from the Agenda
- **WHEN** the user is choosing what to add from a selected day
- **THEN** creating a new debtor or recording an abono is not offered as an option
