## ADDED Requirements

### Requirement: Monthly entry status legend
The system SHALL display, on the Concept Detail screen, a fixed and always-visible legend explaining the visual states a monthly entry can show (paid/received, overdue, pending, no entry), without relying on hover or a click-to-reveal interaction.

#### Scenario: Legend is visible without interaction
- **WHEN** the user opens the Concept Detail screen
- **THEN** the legend explaining the entry states is visible without hovering, tapping, or opening any menu

#### Scenario: Legend covers all entry states
- **WHEN** the user reads the legend
- **THEN** it explains all four visual states an entry can show: paid/received, overdue, pending, and no entry

### Requirement: Delete a single month's entry
The system SHALL let the user delete a single monthly entry from the Concept Detail screen, restoring that month to its "no entry" state, but only for concepts without a fixed schedule (no amortization terms and no `duracion_meses`). The delete action SHALL only be offered for a month that currently has an entry.

#### Scenario: Deleting an entry restores it to "no entry"
- **WHEN** the user deletes an existing monthly entry on a concept without a fixed schedule
- **THEN** that month reverts to showing no planned amount, as if it had never been recorded

#### Scenario: Delete action is unavailable on a fixed schedule
- **WHEN** the user views a monthly entry belonging to a concept with amortization terms or a `duracion_meses`
- **THEN** no delete action is offered for that entry

#### Scenario: Delete action is unavailable on a month with no entry
- **WHEN** the user views a month that has no recorded entry
- **THEN** no delete action is offered for that month

#### Scenario: Deleting an entry updates dependent figures
- **WHEN** the user deletes a monthly entry
- **THEN** any figures that depend on it (such as a debt's remaining balance or the monthly summary) reflect the deletion without requiring a manual page reload
