## MODIFIED Requirements

### Requirement: Twelve-month entry list
The system SHALL display the concept's monthly entries for a selectable year as a list (not a spreadsheet-style grid), each entry showing its month, planned amount, and paid/pending status, with the current calendar month visually distinguished from past and future months. When the selected year is the current calendar year, months that have already passed SHALL be collapsed behind a single control by default, while the current month and future months SHALL always be shown in full; when the selected year is not the current calendar year, all twelve months SHALL be shown in full regardless of the collapse default.

#### Scenario: Month with no entry yet
- **WHEN** a given month has no monthly entry recorded for the concept
- **THEN** that month is still shown in the list, indicated as having no planned amount, rather than being omitted

#### Scenario: Viewing a different year
- **WHEN** the user selects a year other than the current one
- **THEN** the list updates to show that year's twelve monthly entries for the concept

#### Scenario: Past months of the current year are collapsed by default
- **WHEN** the user opens the current year's entry list and it contains one or more months that have already passed
- **THEN** those past months are hidden behind a single control, while the current month and any future months are shown

#### Scenario: Expanding reveals past months
- **WHEN** the user activates the "show past months" control
- **THEN** the previously hidden past months of the current year become visible in the list

#### Scenario: A past year is never collapsed
- **WHEN** the user navigates to a year before the current calendar year
- **THEN** all twelve months of that year are shown in full, with no collapse control

## ADDED Requirements

### Requirement: Year navigation is bounded by the concept's creation date
The system SHALL prevent navigating the year selector to a year before the concept's creation year, and SHALL NOT bound navigation toward future years.

#### Scenario: Cannot navigate before the concept's creation year
- **WHEN** the selected year equals the concept's creation year
- **THEN** the control for navigating to an earlier year has no effect

#### Scenario: Future navigation remains unbounded
- **WHEN** the user navigates the year selector forward
- **THEN** there is no upper limit on how many years ahead the user can navigate
