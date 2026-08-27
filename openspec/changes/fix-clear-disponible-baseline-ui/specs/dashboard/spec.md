## MODIFIED Requirements

### Requirement: Disponible card shows the real, accumulated available balance
The system SHALL display, on the Dashboard next to "Balance del mes", a card showing the user's Disponible figure (accumulated since their configured baseline date) and their Ahorros figure, both editable inline. The system SHALL let the user clear the Disponible baseline back to unconfigured from the same editing view.

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

#### Scenario: Clearing Disponible returns to the setup prompt
- **WHEN** the user activates "Quitar" while editing a configured Disponible figure
- **THEN** the baseline is cleared and the card shows the setup prompt again, as if never configured
