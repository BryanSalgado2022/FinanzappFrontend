# debtor-management Specification

## Purpose
Gives the user a dedicated place to register who they've lent money to, track how much each person still owes as they make partial payments, and see at a glance how much they're owed in total — so lending money doesn't mean losing track of it.

## Requirements

### Requirement: Deudores screen is reachable from primary navigation
The system SHALL provide a "Deudores" link in the main navigation header, alongside Dashboard, Deudas, Categorías, and Tareas, that navigates to a screen listing the user's debtors.

#### Scenario: Navigating to Deudores
- **WHEN** the user activates the "Deudores" link in the header
- **THEN** the app navigates to the Deudores screen and shows the user's current debtors

### Requirement: Deudores list shows summary figures computed from the debtor list
The system SHALL display, on the Deudores screen, three summary figures computed from the loaded list of debtors: the total remaining balance owed across active debtors, the number of active debtors, and the number of active debtors with collateral (`garantia`) recorded.

#### Scenario: Summary reflects active debtors only
- **WHEN** the user has both active and closed (terminado) debtors
- **THEN** the summary figures are computed only from the active ones

#### Scenario: Total owed sums remaining balances, not original amounts
- **WHEN** one or more active debtors have recorded abonos reducing their balance
- **THEN** the total owed figure reflects each debtor's current remaining balance, not their original `monto_total`

### Requirement: Create a debtor
The system SHALL let the user create a debtor via a modal form, entering a required nombre, monto_total, and fecha, and optionally a garantia.

#### Scenario: Creating a debtor with required fields only
- **WHEN** the user submits the creation form with nombre, monto_total, and fecha, and no garantia
- **THEN** a new debtor is created and appears in the list with its full monto_total as its remaining balance

#### Scenario: Creating a debtor with collateral
- **WHEN** the user submits the creation form with a garantia value provided
- **THEN** the new debtor is created with that collateral recorded, and counts toward the "con garantía" summary figure

### Requirement: Debtor detail shows remaining balance and progress
The system SHALL display, on a debtor's detail screen, their name, remaining balance, original monto_total, fecha, and garantia (when set), with a visual progress indicator showing the proportion repaid.

#### Scenario: Progress indicator reflects recorded abonos
- **WHEN** a debtor has one or more abonos recorded
- **THEN** the progress indicator and remaining balance reflect the sum of those abonos subtracted from monto_total

#### Scenario: Debtor without collateral shows no collateral field
- **WHEN** a debtor has no garantia set
- **THEN** the detail screen does not display a collateral field

### Requirement: Edit and close a debtor
The system SHALL let the user edit a debtor's nombre, monto_total, fecha, and garantia from the detail screen, mark it as terminado (closed), and delete it.

#### Scenario: Editing debtor details
- **WHEN** the user edits a debtor's nombre, monto_total, fecha, or garantia and saves
- **THEN** the detail screen reflects the updated values

#### Scenario: Closing a debtor with a remaining balance
- **WHEN** the user marks a debtor as terminado while it still has a remaining balance
- **THEN** the app accepts it and the debtor no longer counts toward the Deudores list's summary figures

#### Scenario: Deleting a debtor
- **WHEN** the user deletes a debtor
- **THEN** the app navigates back to the Deudores list and the debtor (and its abonos) no longer appear anywhere

### Requirement: Record and remove abonos
The system SHALL let the user record an abono (partial payment) against a debtor from their detail screen, entering a required monto and fecha, and SHALL let the user delete a previously recorded abono.

#### Scenario: Recording an abono updates the remaining balance
- **WHEN** the user records an abono with a monto and fecha
- **THEN** the abono appears in the debtor's payment history and the remaining balance decreases accordingly, without a manual page reload

#### Scenario: Deleting an abono restores the balance
- **WHEN** the user deletes a previously recorded abono
- **THEN** the abono no longer appears in the payment history and the remaining balance increases accordingly

#### Scenario: Abono history is ordered most recent first
- **WHEN** a debtor has multiple abonos recorded
- **THEN** they are listed with the most recently dated one first
