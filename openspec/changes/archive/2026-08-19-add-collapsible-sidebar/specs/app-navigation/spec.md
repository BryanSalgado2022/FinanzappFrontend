## MODIFIED Requirements

### Requirement: Top bar
The system SHALL display, on every authenticated screen, a top bar containing the app logo (linking to the Dashboard), a control to open the sidebar shown only on screens narrower than `md:` (768px), and the existing user actions (user's name, theme toggle, sign out).

#### Scenario: Top bar is present on every authenticated screen
- **WHEN** the user is on any authenticated screen
- **THEN** the top bar with logo and user actions is visible

#### Scenario: Logo navigates to the Dashboard
- **WHEN** the user activates the logo
- **THEN** the app navigates to the Dashboard

#### Scenario: Sidebar-open control only shown below md:
- **WHEN** the viewport is narrower than `md:` (768px)
- **THEN** the top bar shows a control to open the sidebar

#### Scenario: Sidebar-open control hidden from md: up
- **WHEN** the viewport is `md:` (768px) or wider
- **THEN** the top bar does not show a sidebar-open control, since the sidebar is already visible

### Requirement: Sidebar starts closed and holds the navigation links
The system SHALL provide a sidebar containing links to every section of the app (Dashboard, Agenda, Deudas, Categorías, Tareas, Deudores, Gastos). Below `md:` (768px), the sidebar is closed by default whenever the app loads. From `md:` up, the sidebar is always visible and starts expanded by default.

#### Scenario: Sidebar is closed on initial load
- **WHEN** the app loads on a screen narrower than `md:` (768px)
- **THEN** the sidebar is not visible until the user opens it

#### Scenario: Sidebar state does not persist across loads
- **WHEN** the user opens the sidebar on a screen narrower than `md:`, then reloads or revisits the app later on a screen narrower than `md:`
- **THEN** the sidebar starts closed again, regardless of its state before the reload

#### Scenario: Sidebar lists every section with its current label
- **WHEN** the user opens the sidebar, or the sidebar is expanded on `md:` and wider
- **THEN** it shows all seven navigation links, each with its icon and full text label

#### Scenario: Active section is visually distinguished
- **WHEN** the sidebar is visible while the user is on one of its linked sections
- **THEN** that section's link is visually distinguished from the others

#### Scenario: Sidebar starts expanded on initial load from md: up
- **WHEN** the app loads for the first time on a screen `md:` (768px) or wider, with no previously saved collapse preference
- **THEN** the sidebar is visible and expanded, showing icons and labels

### Requirement: Sidebar opens and closes as an overlay
Below `md:` (768px), the system SHALL open the sidebar as an overlay above the current screen's content, with a darkened backdrop, without altering the underlying page's layout.

#### Scenario: Opening the sidebar
- **WHEN** the user activates the sidebar-open control in the top bar on a screen narrower than `md:`
- **THEN** the sidebar slides into view above a darkened backdrop

#### Scenario: Closing via backdrop click
- **WHEN** the sidebar is open as an overlay and the user clicks the darkened backdrop outside the sidebar panel
- **THEN** the sidebar closes

#### Scenario: Closing via Escape
- **WHEN** the sidebar is open as an overlay and the user presses Escape
- **THEN** the sidebar closes

#### Scenario: Closing via navigation
- **WHEN** the sidebar is open as an overlay and the user activates any of its navigation links
- **THEN** the app navigates to that section and the sidebar closes

## ADDED Requirements

### Requirement: Sidebar is persistent and collapsible from md: up
From `md:` (768px) up, the system SHALL render the sidebar as a permanent column that pushes the page's content rather than covering it, toggleable by the user between an expanded state (icons and labels) and a collapsed state (icons only), via a control inside the sidebar itself.

#### Scenario: Sidebar is always visible without an open action
- **WHEN** the user is on any authenticated screen at `md:` (768px) or wider
- **THEN** the sidebar is visible without the user needing to open it

#### Scenario: Sidebar pushes content instead of covering it
- **WHEN** the sidebar is visible at `md:` or wider
- **THEN** the page's content is offset to make room for the sidebar, with no darkened backdrop over the content

#### Scenario: Collapsing shows icons only
- **WHEN** the user activates the sidebar's collapse control
- **THEN** the sidebar narrows to an icon-only rail, hiding the text labels

#### Scenario: Collapsed links show their label on hover
- **WHEN** the sidebar is collapsed and the user hovers over one of its icons
- **THEN** a tooltip with that section's label appears

#### Scenario: Expanding shows icons and labels
- **WHEN** the user activates the sidebar's expand control while it is collapsed
- **THEN** the sidebar widens back to show icons with their text labels

#### Scenario: Collapse/expand preference persists across reloads
- **WHEN** the user sets the sidebar to collapsed or expanded at `md:` or wider, then reloads or revisits the app later at `md:` or wider
- **THEN** the sidebar restores the same collapsed/expanded state the user last chose

#### Scenario: Navigating does not change the collapse state
- **WHEN** the user activates a navigation link while the sidebar is visible at `md:` or wider
- **THEN** the app navigates to that section and the sidebar keeps its current collapsed or expanded state
