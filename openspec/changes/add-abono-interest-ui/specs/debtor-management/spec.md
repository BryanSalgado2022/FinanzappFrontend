## MODIFIED Requirements

### Requirement: Record and remove abonos
The system SHALL let the user record an abono (partial payment) against a debtor from their detail screen, entering a required monto and fecha and an optional interest amount (how much of that payment was interest rather than principal), and SHALL let the user delete a previously recorded abono. The interest amount, when entered, SHALL NOT exceed the payment's monto.

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
