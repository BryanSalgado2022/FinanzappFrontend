## ADDED Requirements

### Requirement: Ahorros card shows the user's savings figure
The system SHALL display, on the Dashboard next to "Balance del mes", a dedicated card showing the user's Ahorros figure, editable inline, with the same visual prominence (icon, label, large figure) as the other Dashboard summary cards.

#### Scenario: Ahorros is shown once set
- **WHEN** the user has set an Ahorros figure
- **THEN** the card shows it prominently

#### Scenario: Ahorros is empty by default
- **WHEN** the user has never set an Ahorros figure
- **THEN** the card invites the user to add one, rather than showing an error or a zero value

#### Scenario: Editing Ahorros
- **WHEN** the user edits their Ahorros figure
- **THEN** the new value is saved and reflected immediately

## REMOVED Requirements

### Requirement: Disponible card shows the real, accumulated available balance
**Reason**: The Disponible feature is removed after user testing found the "accumulated since a baseline date" concept confusing. Ahorros is unaffected and gets its own requirement above.
**Migration**: None. No successor for Disponible.

### Requirement: Disponible setup prompt before configuration
**Reason**: Part of the same removed Disponible feature.
**Migration**: None.

### Requirement: Deficit warning compares Disponible against Ahorros
**Reason**: Part of the same removed Disponible feature — the warning depended on the Disponible figure, which no longer exists.
**Migration**: None.
