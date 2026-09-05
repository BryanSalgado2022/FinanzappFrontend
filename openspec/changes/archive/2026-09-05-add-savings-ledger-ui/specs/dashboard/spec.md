## MODIFIED Requirements

### Requirement: Ahorros card shows the user's savings figure
The system SHALL display, on the Dashboard next to "Balance del mes", a dedicated card showing the user's computed Ahorros running balance, with the same visual prominence (icon, label, large figure) as the other Dashboard summary cards. The card SHALL offer a "+ Agregar" control to record a contribution or withdrawal, and a control to view the recorded history, rather than editing the figure inline.

#### Scenario: Ahorros is shown once set
- **WHEN** the user has recorded one or more savings entries
- **THEN** the card shows the resulting balance prominently

#### Scenario: Ahorros is empty by default
- **WHEN** the user has never recorded a savings entry
- **THEN** the card shows a zero balance with copy inviting the user to add their first entry via "+ Agregar", rather than showing an error

#### Scenario: Editing Ahorros
- **WHEN** the user activates "+ Agregar" and submits a monto, fecha, and tipo (aporte or retiro)
- **THEN** the entry is recorded and the card's balance updates immediately, without a manual page reload

#### Scenario: Viewing savings history
- **WHEN** the user activates the history control
- **THEN** every recorded entry is shown with its fecha, monto, and tipo

#### Scenario: Deleting a savings entry from history
- **WHEN** the user deletes an entry from the history view
- **THEN** the entry no longer appears and the card's balance updates accordingly, without a manual page reload
