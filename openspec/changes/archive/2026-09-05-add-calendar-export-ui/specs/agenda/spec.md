## ADDED Requirements

### Requirement: Calendar export control on the Agenda
The system SHALL provide, on the Agenda screen, a control offering to download an `.ics` file of the user's events and to obtain a subscribe URL for automatic updates in an external calendar app.

#### Scenario: Downloading the calendar
- **WHEN** the user activates "Descargar"
- **THEN** the app downloads an `.ics` file for the authenticated user

#### Scenario: Generating a subscribe URL for the first time
- **WHEN** the user has never generated a subscribe token and opens the export control
- **THEN** the app offers to generate one, and shows the resulting URL once generated

#### Scenario: Viewing a previously generated subscribe URL
- **WHEN** the user has already generated a subscribe token and reopens the export control (including after a page reload)
- **THEN** the app shows the existing URL without generating a new one

#### Scenario: Regenerating the subscribe URL
- **WHEN** the user activates "Regenerar"
- **THEN** the app replaces the shown URL with a newly generated one, and the previous URL stops working

#### Scenario: Copying the subscribe URL
- **WHEN** the user activates the copy control next to the subscribe URL
- **THEN** the URL is copied to the clipboard
