## Purpose

Lets the user sign in with their Google account from the browser and keeps every screen behind that session, so no view ever shows or accepts data without an authenticated user.

## ADDED Requirements

### Requirement: Google Sign-In flow
The system SHALL let the user authenticate via a Google Sign-In control, exchange the resulting Google ID token with the backend, and store the returned session token for subsequent API calls.

#### Scenario: Successful sign-in
- **WHEN** the user completes Google Sign-In and the backend accepts the resulting ID token
- **THEN** the app stores the returned session token and treats the user as authenticated

#### Scenario: Backend rejects the Google token
- **WHEN** the backend responds with an authentication error for the exchanged Google ID token
- **THEN** the app shows an error on the Login screen and does not treat the user as authenticated

### Requirement: Session persists across page loads
The system SHALL keep the user authenticated across a page reload as long as the stored session token has not been cleared or rejected by the backend.

#### Scenario: Reload while signed in
- **WHEN** an authenticated user reloads the page
- **THEN** the app restores the session from storage without requiring the user to sign in again

#### Scenario: Backend rejects a stored session token
- **WHEN** an API call with the stored session token fails with an authentication error
- **THEN** the app clears the stored session and treats the user as signed out

### Requirement: Route protection by authentication state
The system SHALL redirect unauthenticated users away from any screen other than Login, and SHALL redirect authenticated users away from Login.

#### Scenario: Unauthenticated user opens a protected screen
- **WHEN** a user with no valid session opens the Dashboard or a Concept Detail URL directly
- **THEN** the app redirects them to Login instead of rendering that screen

#### Scenario: Authenticated user opens Login
- **WHEN** an already-authenticated user navigates to the Login screen
- **THEN** the app redirects them to the Dashboard instead of showing the sign-in control

### Requirement: Sign out
The system SHALL let the authenticated user end their session from within the app.

#### Scenario: User signs out
- **WHEN** an authenticated user triggers sign-out
- **THEN** the app clears the stored session and redirects to Login
