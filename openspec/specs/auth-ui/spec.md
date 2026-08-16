# auth-ui Specification

## Purpose
Lets the user sign in with their Google account or a self-managed email/password from the browser and keeps every screen behind that session, so no view ever shows or accepts data without an authenticated user.

## Requirements

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

### Requirement: Password-based registration
The system SHALL let the user create an account from the Login screen by providing a name, email, and password, without navigating away from Login, and SHALL store the returned session token exactly as it does for Google Sign-In on success.

#### Scenario: Successful registration
- **WHEN** the user submits the registration form with a name, a new email, and a password of at least 8 characters
- **THEN** the app stores the returned session token and treats the user as authenticated

#### Scenario: Registration rejected because the email is already used
- **WHEN** the backend rejects registration because the email already belongs to an account
- **THEN** the app shows an error indicating the email is already registered and does not treat the user as authenticated

#### Scenario: Registration rejected for a too-short password
- **WHEN** the user submits a password shorter than 8 characters
- **THEN** the app shows an error and does not submit or submits and surfaces the backend's rejection, without creating a session

### Requirement: Password-based login
The system SHALL let the user authenticate from the Login screen with an email and password, without navigating away from Login, and SHALL store the returned session token exactly as it does for Google Sign-In on success.

#### Scenario: Successful password login
- **WHEN** the user submits the correct email and password for an existing password-enabled account
- **THEN** the app stores the returned session token and treats the user as authenticated

#### Scenario: Invalid credentials
- **WHEN** the backend rejects the login attempt because the email or password is incorrect
- **THEN** the app shows a single generic invalid-credentials error, without indicating which part was wrong, and does not treat the user as authenticated

### Requirement: Login and registration toggle without navigation
The system SHALL let the user switch between the login form and the registration form from the same Login screen without a route change.

#### Scenario: Switching modes preserves screen context
- **WHEN** the user toggles from login mode to registration mode or back
- **THEN** the app shows the corresponding form on the same screen without navigating to a different URL

### Requirement: Rate-limit feedback
The system SHALL show a clear message when the backend rejects a registration or login attempt for exceeding its rate limit, distinct from an invalid-credentials or email-taken error.

#### Scenario: Too many attempts
- **WHEN** the backend responds that the client has exceeded the registration or login rate limit
- **THEN** the app shows a message indicating too many attempts were made, rather than an invalid-credentials or validation error
