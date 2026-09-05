## MODIFIED Requirements

### Requirement: Amortization terms are never editable
The system SHALL NOT offer a way to edit the starting installment (`cuota_inicial`) for any debt concept — this remains permanently locked. The system SHALL offer a dedicated "Editar términos" control for `valor_total`, interest rate, period, and installment count on a debt concept that already has amortization terms, distinct from the concept's plain name/category edit form, requiring explicit confirmation before submitting since it recalculates the fixed installment and replaces every not-yet-paid monthly entry.

#### Scenario: No edit control for amortization terms
- **WHEN** the user views or edits a debt concept, amortized or not
- **THEN** no control anywhere lets them change `cuota_inicial`

#### Scenario: Editing financial terms on an amortized debt
- **WHEN** the user activates "Editar términos" on a debt concept that has amortization terms
- **THEN** a form opens pre-filled with the current `valor_total`, interest rate, period, and installment count, without `cuota_inicial`

#### Scenario: Confirmation before recalculating
- **WHEN** the user submits a change to financial terms on an amortized debt
- **THEN** the app shows a confirmation explaining that the fixed installment will be recalculated and every not-yet-paid month will be replaced, with already-paid months unaffected, before sending the request

#### Scenario: No term-editing control on non-amortized debts
- **WHEN** the user views a debt concept with no amortization terms
- **THEN** "Editar términos" is not shown — the plain edit form and its existing `valor_total` handling are unaffected by this change
