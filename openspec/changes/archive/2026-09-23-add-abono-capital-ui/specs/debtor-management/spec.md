## ADDED Requirements

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
