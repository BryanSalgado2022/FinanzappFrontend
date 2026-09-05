## ADDED Requirements

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
