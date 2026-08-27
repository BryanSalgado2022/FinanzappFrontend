# landing-page Specification

## Purpose
Gives a first-time, unauthenticated visitor a public page at `/` that explains what TOBE is and why to sign up, replacing the previous immediate bounce to a bare Login form with no context.

## Requirements

### Requirement: Public landing page at the root path
The system SHALL show, at `/`, a public page explaining the product to any visitor without a valid session, without requiring authentication.

#### Scenario: Unauthenticated visitor sees the landing page
- **WHEN** a user with no valid session navigates to `/`
- **THEN** the app renders the landing page rather than redirecting to Login

### Requirement: Hero section explains the product's purpose
The system SHALL display, at the top of the landing page, a headline and subheadline explaining what TOBE is and what problem it solves.

#### Scenario: Visitor sees an explanation before any call to action
- **WHEN** the landing page loads
- **THEN** the headline and subheadline are visible without scrolling on a typical desktop viewport

### Requirement: Feature highlights
The system SHALL display 3 to 4 short feature highlights on the landing page, each summarizing a distinct capability of the app.

#### Scenario: Highlights cover distinct capabilities
- **WHEN** the visitor reads the feature highlights
- **THEN** each highlight describes a different capability of the app, not a repeat of the hero copy

### Requirement: Single call-to-action leads to sign-in
The system SHALL display one primary call-to-action button on the landing page that navigates to the Login screen.

#### Scenario: Visitor activates the call-to-action
- **WHEN** the visitor clicks the primary call-to-action
- **THEN** the app navigates to `/login`, where the existing sign-in and registration options are available

### Requirement: Landing page matches the app's visual design system
The system SHALL style the landing page using the same design tokens (typography, color, light/dark theme) as the rest of the app, rather than a distinct visual treatment.

#### Scenario: Landing page respects the active theme
- **WHEN** the visitor's theme preference is dark or light
- **THEN** the landing page renders in that same theme, consistent with the Login screen
