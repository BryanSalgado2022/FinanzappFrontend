## MODIFIED Requirements

### Requirement: Amortization terms are never editable
The system SHALL NOT offer a way to edit the starting installment (`cuota_inicial`) for any debt concept — this remains permanently locked once set. The system SHALL offer a dedicated "Editar términos" control for `valor_total`, interest rate, period, and installment count on a debt concept that already has amortization terms, distinct from the concept's plain name/category edit form, requiring explicit confirmation before submitting since it recalculates the fixed installment and replaces every not-yet-paid monthly entry. On a debt concept with no amortization terms yet, the system SHALL offer a separate "Agregar términos de amortización" control that sets them for the first time, including an optional starting installment number, also requiring explicit confirmation.

#### Scenario: No edit control for amortization terms
- **WHEN** the user views or edits a debt concept, amortized or not
- **THEN** no control anywhere lets them change an already-set `cuota_inicial`

#### Scenario: Editing financial terms on an amortized debt
- **WHEN** the user activates "Editar términos" on a debt concept that has amortization terms
- **THEN** a form opens pre-filled with the current `valor_total`, interest rate, period, and installment count, without `cuota_inicial`

#### Scenario: Confirmation before recalculating
- **WHEN** the user submits a change to financial terms on an amortized debt
- **THEN** the app shows a confirmation explaining that the fixed installment will be recalculated and every not-yet-paid month will be replaced, with already-paid months unaffected, before sending the request

#### Scenario: No term-editing control on non-amortized debts
- **WHEN** the user views a debt concept with no amortization terms
- **THEN** "Editar términos" is not shown; instead "Agregar términos de amortización" is shown, and the plain edit form and its existing `valor_total` handling are unaffected

#### Scenario: Setting amortization terms for the first time
- **WHEN** the user activates "Agregar términos de amortización" on a debt concept with no amortization terms, and submits `valor_total`, interest rate, period, and installment count
- **THEN** the app shows a confirmation explaining that a schedule will be generated and any existing not-yet-paid monthly entries will be replaced, with already-paid ones kept as history, before sending the request
