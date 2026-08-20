## MODIFIED Requirements

### Requirement: Route protection by authentication state
The system SHALL redirect unauthenticated users away from any authenticated-only screen to Login, and SHALL redirect authenticated users away from both Login and the public landing page to the Dashboard, which is reached at `/dashboard`.

#### Scenario: Unauthenticated user opens a protected screen
- **WHEN** a user with no valid session opens the Dashboard or a Concept Detail URL directly
- **THEN** the app redirects them to Login instead of rendering that screen

#### Scenario: Authenticated user opens Login
- **WHEN** an already-authenticated user navigates to the Login screen
- **THEN** the app redirects them to the Dashboard instead of showing the sign-in control

#### Scenario: Authenticated user opens the landing page
- **WHEN** an already-authenticated user navigates to `/`
- **THEN** the app redirects them to the Dashboard instead of showing the landing page

#### Scenario: Unauthenticated user opens the landing page
- **WHEN** a user with no valid session navigates to `/`
- **THEN** the app shows the landing page rather than redirecting them to Login
