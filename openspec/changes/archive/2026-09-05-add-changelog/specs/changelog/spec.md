## Purpose
Lets users see what's new in TOBE from inside the app — a maintainer-curated list of notable features as they ship — so they don't need to be told outside the app when something important is added.

## ADDED Requirements

### Requirement: Changelog entries are visible from the Header
The system SHALL provide an indicator in the Header that opens a panel listing changelog entries (title, date, short description), newest first.

#### Scenario: Opening the panel
- **WHEN** the user activates the changelog indicator in the Header
- **THEN** a panel opens listing every changelog entry, ordered newest first

#### Scenario: Panel closes like other overlays
- **WHEN** the panel is open and the user clicks outside it or presses Escape
- **THEN** the panel closes

### Requirement: Unseen entries are indicated
The system SHALL show a visual indicator (e.g. a dot) on the Header's changelog control when there are entries dated after the last one the user has seen, and SHALL clear that indicator once the user opens the panel.

#### Scenario: New entry since last visit
- **WHEN** the changelog has an entry newer than the last one the user has seen
- **THEN** the Header shows the unseen indicator

#### Scenario: Opening the panel marks entries seen
- **WHEN** the user opens the changelog panel
- **THEN** the unseen indicator clears and does not reappear until a newer entry is added

#### Scenario: Seen state persists across reloads
- **WHEN** the user reloads the page after having seen the current newest entry
- **THEN** the indicator remains cleared, since the seen state is stored locally

#### Scenario: First-ever visit
- **WHEN** a user has never opened the changelog panel before
- **THEN** the indicator shows if any changelog entries exist
