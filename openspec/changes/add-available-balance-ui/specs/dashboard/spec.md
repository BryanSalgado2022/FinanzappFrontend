## ADDED Requirements

### Requirement: Disponible card shows the real, accumulated available balance
The system SHALL display, on the Dashboard next to "Balance del mes", a card showing the user's Disponible figure (accumulated since their configured baseline date) and their Ahorros figure, both editable inline.

#### Scenario: Disponible is shown once configured
- **WHEN** the user has a configured Disponible baseline
- **THEN** the card shows the current Disponible figure

#### Scenario: Ahorros is shown once set
- **WHEN** the user has set an Ahorros figure
- **THEN** the card shows it alongside Disponible

#### Scenario: Editing Disponible re-baselines it
- **WHEN** the user edits their Disponible starting figure
- **THEN** the new value is saved and Disponible begins accumulating from today going forward, per the backend's re-baselining behavior

#### Scenario: Editing Ahorros
- **WHEN** the user edits their Ahorros figure
- **THEN** the new value is saved and reflected immediately, without affecting Disponible

### Requirement: Disponible setup prompt before configuration
The system SHALL show a setup prompt inviting the user to enter their current available balance, in place of a Disponible figure, until they configure it for the first time.

#### Scenario: First visit before setup
- **WHEN** the user has never configured a Disponible baseline
- **THEN** the card shows a prompt to enter their current available balance instead of a figure

#### Scenario: Completing setup shows the card
- **WHEN** the user enters their current available balance for the first time
- **THEN** the card switches to showing the Disponible figure from then on

### Requirement: Deficit warning compares Disponible against Ahorros
The system SHALL show a warning on the Disponible card when Disponible is negative, stating the deficit amount and the current Ahorros figure, without automatically changing the Ahorros value.

#### Scenario: Disponible goes negative
- **WHEN** Disponible is negative
- **THEN** the card shows a warning with the deficit amount and the current Ahorros figure

#### Scenario: Ahorros is unaffected by the warning
- **WHEN** the deficit warning is shown
- **THEN** the displayed Ahorros figure does not change as a result

#### Scenario: No warning when Ahorros is not set
- **WHEN** Disponible is negative and the user has never set an Ahorros figure
- **THEN** the warning states the deficit without referencing an Ahorros figure
