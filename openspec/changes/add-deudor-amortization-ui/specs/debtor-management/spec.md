## MODIFIED Requirements

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

## ADDED Requirements

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
