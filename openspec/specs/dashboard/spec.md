# dashboard Specification

## Purpose
Gives the user a single at-a-glance view of a chosen month's financial picture — income, expenses, net balance, and which concepts are paid or still pending — replacing the top rows of their spreadsheet.

## Requirements

### Requirement: Month/year selection
The system SHALL let the authenticated user choose which year and month the Dashboard displays, defaulting to the current calendar month on first load.

#### Scenario: Default month on load
- **WHEN** the Dashboard loads with no month/year previously selected in this session
- **THEN** it displays data for the current calendar year and month

#### Scenario: Changing the selected month
- **WHEN** the user picks a different month/year
- **THEN** the summary cards and concept list both update to reflect the newly selected month

### Requirement: Monthly summary cards
The system SHALL display the selected month's total income, total expenses, and net balance, sourced from the backend's monthly summary, where total expenses includes both planned debt/fixed-expense amounts and the month's variable expenses. The balance card SHALL be clickable, opening a breakdown of the selected month's contributors to that balance.

#### Scenario: Positive balance displayed distinctly
- **WHEN** the selected month's net balance is positive
- **THEN** the Dashboard visually distinguishes it from a negative balance (e.g. so the user can tell at a glance whether they're ahead or behind)

#### Scenario: Month with no data
- **WHEN** the selected month has no income or expense entries at all
- **THEN** the summary cards show zero values rather than an error or a blank state

#### Scenario: Opening the balance breakdown
- **WHEN** the user clicks the balance card
- **THEN** a breakdown opens listing every concept entry and variable expense contributing to the selected month's balance, sorted by amount descending, with income and expenses visually separated

#### Scenario: Breakdown reflects the selected month only
- **WHEN** the user opens the balance breakdown
- **THEN** it shows only the currently selected month's contributors, not an annual aggregate

#### Scenario: Empty month shows an empty breakdown
- **WHEN** the user opens the balance breakdown for a month with no concept entries and no variable expenses
- **THEN** the breakdown shows an empty state rather than an error

#### Scenario: Navigating from a concept row
- **WHEN** the user clicks a concept's row in the breakdown
- **THEN** the app navigates to that concept's Concept Detail page

#### Scenario: Navigating from an expense row
- **WHEN** the user clicks a variable expense's row in the breakdown
- **THEN** the app navigates to the Gastos screen, where editing that expense is already possible

### Requirement: Current month's concept list with status
The system SHALL list, below the summary cards, the authenticated user's concepts that have an entry for the selected month, each showing its name, type, and whether that month's entry is paid or pending.

#### Scenario: Concept with a pending entry
- **WHEN** a concept's entry for the selected month has not been marked paid
- **THEN** it appears in the list marked as pending, visually distinct from paid entries

#### Scenario: Concept list is scoped to the authenticated user
- **WHEN** the Dashboard loads
- **THEN** it only lists concepts belonging to the authenticated user, never another user's data

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

### Requirement: Optional due day when creating a debt or fixed expense
The system SHALL let the user optionally provide a due day (an integer from 1 to 28) when creating a `deuda`, `gasto_fijo`, or `ingreso` concept from the Dashboard. For `ingreso`, the field SHALL be labeled as the day it's expected to be received, not as a "due" day.

#### Scenario: Creating a debt with a due day
- **WHEN** the user creates a `deuda` concept and provides a due day
- **THEN** the concept is created with that due day set

#### Scenario: Due day remains optional
- **WHEN** the user creates a `deuda`, `gasto_fijo`, or `ingreso` concept without providing a due day
- **THEN** the concept is created exactly as before this change, with no due day set

#### Scenario: No due-day field for income
- **WHEN** the user creates an `ingreso` concept and provides a day
- **THEN** the concept is created with that day set, and the field is labeled appropriately for income (e.g. "Día de pago"), not "vencimiento"

### Requirement: Optional starting installment when creating a debt with amortization terms
The system SHALL let the user optionally specify a starting installment number when creating a `deuda` concept with amortization terms (interest rate and installment count), and SHALL make clear that this value cannot be changed after creation.

#### Scenario: Creating a debt already partway through its schedule
- **WHEN** the user creates a `deuda` concept with amortization terms and provides a starting installment
- **THEN** the concept is created with that starting installment

#### Scenario: Starting installment remains optional
- **WHEN** the user creates a `deuda` concept with amortization terms and does not provide a starting installment
- **THEN** the concept is created exactly as before this change, starting at the first installment

#### Scenario: Field only appears with amortization terms
- **WHEN** the user is creating a concept without both an interest rate and an installment count entered
- **THEN** the starting-installment field is not shown

### Requirement: Record a variable expense from the Dashboard
The system SHALL let the user create a variable expense directly from the Dashboard without navigating to a separate page first, via a quick-entry control that is visually distinct from the existing "new concept" control.

#### Scenario: Quick-entry control is distinguishable from concept creation
- **WHEN** the user views the Dashboard
- **THEN** the control for recording a variable expense is visually distinct (different label and/or icon) from the control for creating a new concept, so the two actions are not mistaken for each other

#### Scenario: Recording an expense updates the Dashboard
- **WHEN** the user successfully records a variable expense from the Dashboard
- **THEN** the variable-expenses summary section and the summary cards refresh to reflect it without a manual page reload

### Requirement: Variable expenses summary section
The system SHALL display, on the Dashboard, a summary section listing the selected month's most recent variable expenses.

#### Scenario: Section reflects the selected month
- **WHEN** the user changes the Dashboard's selected month
- **THEN** the variable-expenses summary section updates to show that month's expenses

#### Scenario: No variable expenses yet
- **WHEN** the selected month has no variable expenses recorded
- **THEN** the section shows an empty state rather than an error or a blank gap

### Requirement: Payment priority card
The system SHALL display, on the Dashboard above the variable-expenses section, a card highlighting the single most urgent pending `deuda` or `gasto_fijo` entry across all of the user's months — independent of whichever month the Dashboard is currently displaying — where urgency is computed from the entry's due date. An entry qualifies only if it has a `dia_vencimiento` set, is not yet paid, and belongs to a `deuda` or `gasto_fijo` concept — `ingreso` concepts and entries with no due day are never considered.

#### Scenario: Most urgent entry is shown
- **WHEN** the user has one or more qualifying pending entries, in any month
- **THEN** the card shows the name, amount, priority level, and due-date status of the single most urgent one

#### Scenario: Card is unaffected by the Dashboard's month selection
- **WHEN** the user changes which month the Dashboard displays
- **THEN** the payment priority card's highlighted entry does not change, unless changing the month happens to also change which entry is most urgent (e.g. after paying one)

#### Scenario: No qualifying entries
- **WHEN** the user has no qualifying pending entries at all (none exist, all are paid, or none have a due day set)
- **THEN** the card shows an empty/positive state rather than an error, and no "Ver todas" control

#### Scenario: Income concepts are never prioritized
- **WHEN** an `ingreso` concept has a pending, overdue entry
- **THEN** it is never shown by the payment priority card

### Requirement: Priority level is computed from the due date
The system SHALL classify each qualifying entry into exactly one priority level: **Alta** when the entry is overdue, **Media** when its due date is within the next 5 days (inclusive), and **Baja** when its due date is more than 5 days away.

#### Scenario: Overdue entry is Alta
- **WHEN** a qualifying entry's due date has already passed
- **THEN** its priority level is Alta

#### Scenario: Entry due within 5 days is Media
- **WHEN** a qualifying entry's due date is today or within the next 5 days
- **THEN** its priority level is Media

#### Scenario: Entry due later is Baja
- **WHEN** a qualifying entry's due date is more than 5 days away
- **THEN** its priority level is Baja

### Requirement: One-click "Pagar mes" from the priority card
The system SHALL let the user mark the highlighted entry as paid directly from the payment priority card, using its planned amount as the paid amount, without opening an edit form.

#### Scenario: Marking the highlighted entry paid
- **WHEN** the user activates "Pagar mes" on the payment priority card
- **THEN** the entry is marked paid with `monto_pagado` equal to its `monto_planeado`, and the card updates to show the next most urgent qualifying entry (if any)

#### Scenario: Paid amount differs from planned
- **WHEN** the user actually paid a different amount than planned
- **THEN** they can navigate to the concept's detail page from the card to adjust the paid amount there, since the one-click action only covers the exact-planned-amount case

### Requirement: Full priority-ranked list
The system SHALL provide a "Ver todas" control on the payment priority card that opens a list of every qualifying entry across the app (not limited to the selected month's single highlight), ranked by priority level and then by due date within each level.

#### Scenario: Opening the full list
- **WHEN** the user activates "Ver todas"
- **THEN** every qualifying entry is shown, grouped or ordered by priority (Alta first, then Media, then Baja), each entry sorted by soonest due date within its level

#### Scenario: Navigating from the full list
- **WHEN** the user clicks an entry in the full list
- **THEN** the app navigates to that entry's concept detail page

### Requirement: Income has a dedicated one-click entry point
The system SHALL provide a separate "+ Agregar ingreso" control on the Dashboard, distinct from the control used for debts/fixed-expenses/variable-expenses, that opens the income concept creation form directly without an intermediate menu.

#### Scenario: Creating an income concept
- **WHEN** the user activates "+ Agregar ingreso"
- **THEN** the concept creation form opens immediately with `ingreso` as the type, without showing a menu of other options first

#### Scenario: Other creation options remain grouped separately
- **WHEN** the user activates the other "+ Agregar" control
- **THEN** it shows the existing menu of Deuda, Pago mensual, and Gasto puntual, without Ingreso listed among them

### Requirement: Ahorros card shows the user's savings figure
The system SHALL display, on the Dashboard next to "Balance del mes", a dedicated card showing the user's Ahorros figure, editable inline, with the same visual prominence (icon, label, large figure) as the other Dashboard summary cards.

#### Scenario: Ahorros is shown once set
- **WHEN** the user has set an Ahorros figure
- **THEN** the card shows it prominently

#### Scenario: Ahorros is empty by default
- **WHEN** the user has never set an Ahorros figure
- **THEN** the card invites the user to add one, rather than showing an error or a zero value

#### Scenario: Editing Ahorros
- **WHEN** the user edits their Ahorros figure
- **THEN** the new value is saved and reflected immediately
