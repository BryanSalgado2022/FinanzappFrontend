## Purpose

Provides the global navigation shell shared by every authenticated screen: a top bar with the app logo and user actions, and a hidden-by-default sidebar for moving between the app's sections, so the top bar stays uncluttered as more sections are added.

## ADDED Requirements

### Requirement: Top bar
The system SHALL display, on every authenticated screen, a top bar containing the app logo (linking to the Dashboard), a control to open the sidebar, and the existing user actions (user's name, theme toggle, sign out).

#### Scenario: Top bar is present on every authenticated screen
- **WHEN** the user is on any authenticated screen
- **THEN** the top bar with logo, sidebar-open control, and user actions is visible

#### Scenario: Logo navigates to the Dashboard
- **WHEN** the user activates the logo
- **THEN** the app navigates to the Dashboard

### Requirement: Sidebar starts closed and holds the navigation links
The system SHALL provide a sidebar containing links to every section of the app (Dashboard, Deudas, Categorías, Tareas, Deudores, Gastos), closed by default whenever the app loads, on every screen size.

#### Scenario: Sidebar is closed on initial load
- **WHEN** the app loads, on any screen size
- **THEN** the sidebar is not visible until the user opens it

#### Scenario: Sidebar state does not persist across loads
- **WHEN** the user opens the sidebar, then reloads or revisits the app later
- **THEN** the sidebar starts closed again, regardless of its state before the reload

#### Scenario: Sidebar lists every section with its current label
- **WHEN** the user opens the sidebar
- **THEN** it shows all six navigation links, each with its icon and full text label

#### Scenario: Active section is visually distinguished
- **WHEN** the user opens the sidebar while on one of its linked sections
- **THEN** that section's link is visually distinguished from the others

### Requirement: Sidebar opens and closes as an overlay
The system SHALL open the sidebar as an overlay above the current screen's content, with a darkened backdrop, without altering the underlying page's layout.

#### Scenario: Opening the sidebar
- **WHEN** the user activates the sidebar-open control in the top bar
- **THEN** the sidebar slides into view above a darkened backdrop

#### Scenario: Closing via backdrop click
- **WHEN** the sidebar is open and the user clicks the darkened backdrop outside the sidebar panel
- **THEN** the sidebar closes

#### Scenario: Closing via Escape
- **WHEN** the sidebar is open and the user presses Escape
- **THEN** the sidebar closes

#### Scenario: Closing via navigation
- **WHEN** the sidebar is open and the user activates any of its navigation links
- **THEN** the app navigates to that section and the sidebar closes
