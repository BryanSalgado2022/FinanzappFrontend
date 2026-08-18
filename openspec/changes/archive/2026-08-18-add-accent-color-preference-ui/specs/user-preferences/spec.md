## Purpose

Lets the user personalize the app's accent color from a curated palette, applied immediately and persisted to their account so it follows them across devices.

## ADDED Requirements

### Requirement: Choose an accent color
The system SHALL let the user open a color picker from the Header and choose one of nine curated accent colors.

#### Scenario: Opening the picker
- **WHEN** the user activates the accent-color control in the Header
- **THEN** a panel showing all nine curated color options appears

#### Scenario: Choosing a color updates the app immediately
- **WHEN** the user selects one of the curated colors
- **THEN** the app's highlighted/accented UI elements reflect that color without a page reload

#### Scenario: Currently selected color is indicated
- **WHEN** the user opens the picker and has previously chosen a color
- **THEN** that color is visually marked as the current selection

### Requirement: Choice persists to the user's account
The system SHALL save the user's chosen accent color to their account, so it is restored on any device or browser where they sign in.

#### Scenario: Color survives a page reload
- **WHEN** the user selects a color and then reloads the page
- **THEN** the app applies that same color again after reload

#### Scenario: Color follows the account across sessions
- **WHEN** the user signs in on a different browser or after clearing local data
- **THEN** their previously chosen accent color is applied, not the app's default

### Requirement: Picker closes like other overlays
The system SHALL close the accent-color picker on an outside click, on Escape, or after a color is selected.

#### Scenario: Closing via outside click or Escape
- **WHEN** the picker is open and the user clicks outside it or presses Escape
- **THEN** the picker closes without changing the current selection

#### Scenario: Closing after selection
- **WHEN** the user selects a color from the picker
- **THEN** the picker closes
