## MODIFIED Requirements

### Requirement: Dedicated Agenda screen
The system SHALL provide a dedicated Agenda screen, reachable from the Sidebar, showing a full month-grid calendar for a selected year and month. In addition to the previous/next-month arrows and the year selector, the system SHALL provide a month selector letting the user jump directly to any month within the selected year in one action.

#### Scenario: Navigating to the Agenda
- **WHEN** the user activates the Agenda link in the Sidebar
- **THEN** the app navigates to the Agenda screen and shows the current calendar month by default

#### Scenario: Month and year navigation
- **WHEN** the user navigates to the previous or next month, or selects a different year
- **THEN** the calendar updates to show that month, and its events reload

#### Scenario: Jumping directly to a month
- **WHEN** the user selects a different month from the month selector
- **THEN** the calendar updates to show that month within the currently selected year, and its events reload, without requiring repeated clicks on the previous/next arrows
