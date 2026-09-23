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
The system SHALL let the user create a debtor via a modal form, entering a required nombre, monto_total, and fecha, and optionally a garantia. The form SHALL also let the user optionally set amortization terms (tasa_interes, periodo_tasa, numero_cuotas, and an optional starting installment number), with tasa_interes and numero_cuotas required together.

#### Scenario: Creating a debtor with required fields only
- **WHEN** the user submits the creation form with nombre, monto_total, and fecha, and no garantia
- **THEN** a new debtor is created and appears in the list with its full monto_total as its remaining balance

#### Scenario: Creating a debtor with collateral
- **WHEN** the user submits the creation form with a garantia value provided
- **THEN** the new debtor is created with that collateral recorded, and counts toward the "con garantía" summary figure

#### Scenario: Creating an amortized debtor
- **WHEN** the user submits the creation form with tasa_interes, periodo_tasa, and numero_cuotas
- **THEN** the new debtor is created with those terms, and its detail screen shows the generated installment schedule instead of a place to record free-form abonos

#### Scenario: tasa_interes and numero_cuotas must be provided together
- **WHEN** the user submits the creation form with only one of tasa_interes or numero_cuotas filled in
- **THEN** the app rejects the submission and does not create the debtor

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
The system SHALL let the user record an abono (partial payment) against a non-amortized debtor from their detail screen, entering a required monto and fecha and an optional interest amount (how much of that payment was interest rather than principal), and SHALL let the user delete a previously recorded abono. The interest amount, when entered, SHALL NOT exceed the payment's monto. For an amortized debtor, the system SHALL NOT show this form — amortized debtors record payments through their installment schedule instead.

#### Scenario: Recording an abono updates the remaining balance
- **WHEN** the user records an abono with a monto and fecha
- **THEN** the abono appears in the debtor's payment history and the remaining balance decreases accordingly, without a manual page reload

#### Scenario: Deleting an abono restores the balance
- **WHEN** the user deletes a previously recorded abono
- **THEN** the abono no longer appears in the payment history and the remaining balance increases accordingly

#### Scenario: Abono history is ordered most recent first
- **WHEN** a debtor has multiple abonos recorded
- **THEN** they are listed with the most recently dated one first

#### Scenario: Recording an abono with an interest portion
- **WHEN** the user enters an interest amount less than or equal to the monto
- **THEN** the abono is recorded with that interest amount, and the debtor's remaining balance decreases only by the principal portion (monto minus interest)

#### Scenario: Interest amount is optional
- **WHEN** the user records an abono without entering an interest amount
- **THEN** the abono is recorded exactly as before this change, with the full monto counted as principal

#### Scenario: Interest cannot exceed the payment amount
- **WHEN** the user enters an interest amount greater than the monto
- **THEN** the form does not submit, and an error is shown rather than sending an invalid request

#### Scenario: No abono form for an amortized debtor
- **WHEN** the user views an amortized debtor's detail screen
- **THEN** no "Registrar abono" form or abono history is shown

### Requirement: View and pay a debtor's installment schedule
The system SHALL, for an amortized debtor, show its generated installment schedule on the detail screen, with each installment's period, planned amount, and paid state. The system SHALL let the user mark an unpaid installment paid, and mark a paid installment unpaid again.

#### Scenario: Schedule is shown for an amortized debtor
- **WHEN** the user views an amortized debtor's detail screen
- **THEN** every installment in its generated schedule is listed with its period, planned amount, and paid state

#### Scenario: Marking an installment paid
- **WHEN** the user marks an unpaid installment paid
- **THEN** the installment shows as paid, without a manual page reload, and the debtor's remaining balance reflects it

#### Scenario: Marking an installment unpaid
- **WHEN** the user marks a previously paid installment unpaid
- **THEN** the installment shows as unpaid again and the debtor's remaining balance reflects it

### Requirement: Correct an amortized debtor's terms
The system SHALL, for an amortized debtor, show its fixed installment amount, interest rate, and number of installments on the detail screen, with an "Editar términos" control to correct monto_total, tasa_interes, periodo_tasa, and numero_cuotas together. The system SHALL show a confirmation, before submitting, explaining that unpaid installments will be replaced while paid ones are unaffected.

#### Scenario: Amortization summary is shown
- **WHEN** the user views an amortized debtor's detail screen
- **THEN** its fixed installment amount, interest rate and period, and number of installments are displayed

#### Scenario: Editing terms shows a confirmation before submitting
- **WHEN** the user changes an amortized debtor's terms and submits
- **THEN** the app shows a confirmation explaining that unpaid installments will be replaced and paid ones will be unaffected, before sending the request

#### Scenario: Correcting terms updates the schedule
- **WHEN** the user confirms a change to an amortized debtor's terms
- **THEN** the fixed installment amount and schedule update to reflect the new terms, without a manual page reload

#### Scenario: Rejected correction shows the server's error
- **WHEN** the user submits a term correction that the server rejects (for example, reducing numero_cuotas below installments already paid)
- **THEN** the app shows the server's error message and does not clear the form

### Requirement: Set amortization terms on a plain debtor
The system SHALL, for a debtor with no amortization terms, show an "Agregar términos de amortización" control on the detail screen, opening a form for monto_total, tasa_interes, periodo_tasa, numero_cuotas, and an optional starting installment number. The system SHALL show a confirmation, before submitting, explaining that a schedule will be generated and any existing not-yet-paid installments replaced, with existing abonos kept as history.

#### Scenario: Control is shown only on non-amortized debtors
- **WHEN** the user views a debtor with no amortization terms
- **THEN** "Agregar términos de amortización" is shown instead of "Editar términos"

#### Scenario: Setting terms for the first time generates the schedule
- **WHEN** the user submits monto_total, tasa_interes, periodo_tasa, and numero_cuotas on a non-amortized debtor and confirms
- **THEN** the debtor's schedule is generated and the detail screen switches to showing the cronograma, without a manual page reload

#### Scenario: Rejected activation shows the server's error
- **WHEN** the user submits an activation the server rejects
- **THEN** the app shows the server's error message and does not clear the form

### Requirement: Record a principal prepayment on an amortized debtor
The system SHALL, for an amortized debtor, show an "Abono a capital" control next to the cronograma, opening a form for monto, fecha, and a choice between `reducir_plazo` (keep the fixed installment, shorten the term) and `reducir_cuota` (keep the term, lower the fixed installment). The system SHALL show a confirmation, before submitting, explaining that the remaining schedule will be regenerated and that a prepayment covering the full balance finalizes the debtor.

#### Scenario: Control is shown only on amortized debtors
- **WHEN** the user views an amortized debtor
- **THEN** "Abono a capital" is shown next to the cronograma

#### Scenario: Recording a partial prepayment regenerates the schedule
- **WHEN** the user submits a monto smaller than the remaining balance, picks a modo, and confirms
- **THEN** the cronograma and cuota fija reflect the new schedule without a manual page reload

#### Scenario: Recording a full prepayment finalizes the debtor
- **WHEN** the user submits a monto that settles the remaining balance and confirms
- **THEN** the debtor is shown as terminado and the cronograma is cleared, without a separate finalize action

#### Scenario: Rejected prepayment shows the server's error
- **WHEN** the user submits a prepayment the server rejects
- **THEN** the app shows the server's error message and does not clear the form

### Requirement: Prepayment history is shown alongside the schedule
The system SHALL show a history list of recorded principal prepayments (abonos with `es_abono_capital: true`) alongside the cronograma, each deletable like a regular abono.

#### Scenario: Prepayments are listed after being recorded
- **WHEN** an amortized debtor has one or more principal prepayments recorded
- **THEN** each is shown in the prepayment history list, distinct from the cronograma's installment rows

#### Scenario: Deleting a prepayment removes it from history
- **WHEN** the user deletes a prepayment from the history list
- **THEN** it no longer appears, and the debtor's saldo restante reflects the removal

### Requirement: Route a payment surplus into a principal prepayment when marking an installment paid
The system SHALL let a user enter the actual amount paid when marking a debtor's installment paid. When the entered amount exceeds the installment's planned amount, the system SHALL show an inline choice between `reducir_plazo` and `reducir_cuota` and, on save, route the surplus into a principal prepayment per that choice in the same request, without a separate confirmation step.

#### Scenario: Entering an amount expands into an editable row
- **WHEN** a user opens an installment in the schedule to mark it paid
- **THEN** the row expands into a form with an editable amount field, mirroring the monthly-entry editing pattern

#### Scenario: A surplus reveals the modo choice
- **WHEN** the entered amount exceeds the installment's planned amount
- **THEN** an inline "Reducir plazo"/"Reducir cuota" choice appears, defaulting to "Reducir cuota"

#### Scenario: Saving a surplus routes it without extra confirmation
- **WHEN** a user picks a modo and saves
- **THEN** the request is sent immediately, with no separate confirmation step

#### Scenario: No surplus, no mode sent
- **WHEN** the entered amount does not exceed the planned amount
- **THEN** the request is sent without an `abono_capital_modo`, preserving today's behavior exactly
