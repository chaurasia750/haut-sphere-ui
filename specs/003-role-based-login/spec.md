# Feature Specification: Role-Based Login

**Feature Branch**: `003-role-based-login`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "create a login page and implement login features after login success then login returns role id if roleid is 1 and 2 then go to admin module and if role id is 3 then go to member page and if roleid is 4 then go to manager modules"

## Clarifications

### Session 2026-04-30

- Q: What happens to authentication state after login? → A: Session persists across page reloads until explicit logout or timeout, with frontend router guard + backend validation required.
- Q: What is the session timeout duration? → A: 30 minutes of inactivity before requiring re-authentication.
- Q: What is the authentication API response structure? → A: `{ "accessToken", "refreshToken", "roleId", "userId" }` - refresh token enables automatic session extension without re-login.
- Q: What happens when an unknown/invalid role ID is returned? → A: Log error server-side, display generic "Unable to access system at this time" message, redirect to login.
- Q: Where should tokens be stored? → A: httpOnly Secure SameSite cookies - most secure, backend-controlled, XSS-resistant, automatic transmission on requests.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication (Priority: P1)

A user needs to log into the system by providing their credentials. This is the foundational feature that must work before any routing can occur.

**Why this priority**: Authentication is the critical first step—nothing else is possible without successful login. This is the highest-value entry point to the system.

**Independent Test**: Can be fully tested by attempting login with valid credentials and verifying the login succeeds and returns a role ID, delivering core access control value.

**Acceptance Scenarios**:

1. **Given** the login page is displayed, **When** a user enters valid email/password and clicks submit, **Then** the system authenticates the user and returns a role ID
2. **Given** a user submits the login form, **When** credentials are invalid, **Then** the system displays an error message and login fails
3. **Given** the login page, **When** a user enters their credentials, **Then** form validation ensures required fields are not empty

---

### User Story 2 - Admin Role Routing (Priority: P2)

Users with admin privileges (role ID 1 or 2) need to be automatically routed to the admin module after successful login.

**Why this priority**: Admin routing is core to providing different experiences for different user types. Role ID 1 & 2 represent admin-level access and are fundamental to system governance.

**Independent Test**: Can be fully tested by logging in with credentials that return role ID 1 or 2 and verifying navigation to the admin module, delivering admin-specific functionality access.

**Acceptance Scenarios**:

1. **Given** a user with role ID 1 logs in successfully, **When** authentication completes, **Then** the user is automatically routed to the admin module
2. **Given** a user with role ID 2 logs in successfully, **When** authentication completes, **Then** the user is automatically routed to the admin module
3. **Given** a user is routed to admin module, **When** the page loads, **Then** admin-specific navigation and features are displayed

---

### User Story 3 - Member Role Routing (Priority: P2)

Users with member privileges (role ID 3) need to be automatically routed to the member page after successful login.

**Why this priority**: Member routing provides standard user access with different functionality than admins. Role ID 3 represents the typical end-user experience.

**Independent Test**: Can be fully tested by logging in with credentials that return role ID 3 and verifying navigation to the member page, delivering standard user functionality.

**Acceptance Scenarios**:

1. **Given** a user with role ID 3 logs in successfully, **When** authentication completes, **Then** the user is automatically routed to the member page
2. **Given** a user is on the member page, **When** the page loads, **Then** member-specific content and features are displayed

---

### User Story 4 - Manager Role Routing (Priority: P2)

Users with manager privileges (role ID 4) need to be automatically routed to the manager module after successful login.

**Why this priority**: Manager routing enables management-specific workflows. Role ID 4 represents supervisory/management-level access.

**Independent Test**: Can be fully tested by logging in with credentials that return role ID 4 and verifying navigation to the manager module, delivering management-specific functionality.

**Acceptance Scenarios**:

1. **Given** a user with role ID 4 logs in successfully, **When** authentication completes, **Then** the user is automatically routed to the manager module
2. **Given** a user is on the manager module, **When** the page loads, **Then** manager-specific navigation and features are displayed

---

### User Story 5 - Login Error Handling (Priority: P3)

Users need to receive clear feedback when login fails, including specific error messages for different failure scenarios.

**Why this priority**: While error handling is important for UX polish, it's less critical than core authentication and routing. However, it prevents user confusion when things go wrong.

**Independent Test**: Can be fully tested by attempting login with invalid credentials or when the system is unavailable and verifying appropriate error messages display.

**Acceptance Scenarios**:

1. **Given** a user enters incorrect credentials, **When** they submit the login form, **Then** an "Invalid credentials" error is displayed
2. **Given** a login request fails due to server error, **When** the error occurs, **Then** an appropriate error message is shown to the user
3. **Given** an error is displayed, **When** the user corrects their credentials, **Then** they can retry login

---

### Edge Cases

- What happens when the server returns an unknown or undefined role ID during login? → **System logs error, displays "Unable to access system at this time", redirects to login**
- How does the system handle concurrent login attempts from the same user? → Sessions are independent; last login wins and previous sessions become invalid
- What happens if the API call to fetch role ID fails mid-authentication? → Treat as authentication failure, display appropriate error, return to login
- How should the system behave if a user tries to navigate directly to a module URL that doesn't match their role? → Router guard validates role before allowing access; redirect to user's assigned module
- What happens when the login session expires or becomes invalid? → User is redirected to login page with "Session expired" message on next action or page load

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a login page with email/password input fields
- **FR-002**: System MUST validate that email and password fields are not empty before submission
- **FR-003**: System MUST validate that email format is valid (standard email pattern)
- **FR-004**: System MUST authenticate user credentials against the backend authentication service
- **FR-005**: System MUST return the user's role ID upon successful authentication
- **FR-006**: System MUST route users with role ID 1 to the admin module
- **FR-007**: System MUST route users with role ID 2 to the admin module
- **FR-008**: System MUST route users with role ID 3 to the member page
- **FR-009**: System MUST route users with role ID 4 to the manager module
- **FR-010**: System MUST display an error message when authentication fails
- **FR-011**: System MUST display form validation errors before attempting authentication
- **FR-012**: System MUST clear the login form on successful authentication
- **FR-013**: System MUST prevent form submission while authentication is in progress
- **FR-014**: System MUST implement frontend router guards that redirect unauthenticated users to login
- **FR-015**: System MUST validate session state with backend on protected route access
- **FR-016**: System MUST clear session on explicit logout or timeout
- **FR-017**: System MUST support configurable session timeout duration (30 minutes)
- **FR-018**: System MUST store accessToken and refreshToken in httpOnly, Secure, SameSite cookies
- **FR-019**: System MUST not expose tokens to JavaScript (httpOnly flag prevents document.cookie access)
- **FR-020**: System MUST automatically transmit tokens on all authenticated requests via cookies
- **FR-021**: System MUST set cookie flags: HttpOnly=true, Secure=true, SameSite=Strict
- **FR-022**: System MUST clear cookies on logout (backend-set Set-Cookie with Max-Age=0)
- **FR-023**: System MUST validate that returned roleId is one of (1, 2, 3, 4)
- **FR-024**: System MUST log invalid role ID errors server-side for security auditing
- **FR-025**: System MUST display generic "Unable to access system at this time" message on invalid role
- **FR-026**: System MUST redirect to login page if role validation fails
- **FR-027**: System MUST detect concurrent login attempts and invalidate previous session tokens
- **FR-028**: System MUST use refreshToken to automatically extend accessToken before expiry
- **FR-029**: System MUST handle refreshToken expiry by returning user to login page

### Key Entities *(include if feature involves data)*

- **User**: Represents a person logging into the system with unique accessToken, refreshToken, roleId, userId, and expiry
- **Role**: Enum of valid role IDs (1, 2, 3, 4) that determine routing destination
- **LoginError**: Error states including invalid credentials, validation errors, and server errors
- **TokenPair**: The accessToken (for API calls) and refreshToken (fcredentials (email, password) and assigned role
- **AuthResponse**: Response from authentication service containing `{ "accessToken", "refreshToken", "roleId", "userId" }` stored in httpOnly cookies
- **Role**: Enum of valid role IDs (1, 2, 3, 4) that determine routing destination
- **TokenPair**: The accessToken (for API calls, short-lived ~30 min) and refreshToken (for session extension, long-lived) returned by auth service
- **LoginError**: Error states including invalid credentials, validation errors, server errors, and invalid role ID
### Measurable Outcomes

- Users can successfully log in with valid credentials in under 2 seconds
- 100% of role-based routing works correctly (all role IDs 1-4 route to intended destinations)
- Form validation prevents invalid submissions and gives users clear feedback
- Authentication errors are displayed to users within 500ms of failure
- System supports at least 1000 concurrent login attempts per minute
- 95% of login operations complete successfully without timeout
- Password fields mask sensitive input (no plain text visible)
- Session persists correctly across page reloads (verified by manual refresh and programmatic navigation)
- Session is properly cleared on logout (all tokens removed from storage, user redirected to login)
- Session timeout occurs after 30 minutes of inactivity and requires re-authentication

### Quality Metrics

- Login process is intuitive and requires no additional training
- Error messages clearly explain what went wrong and how to fix it
- All user roles can complete login in a single user session
- Routing happens seamlessly without visible delays or redirects
- System is resistant to XSS attacks (tokens not exposed to JavaScript)
- Concurrent login attempts properly invalidate previous sessions

## Assumptions

- Email/password authentication is the required method (no SSO, OAuth, or multi-factor authentication at this stage)
- Backend authentication API exists and returns structured response with accessToken, refreshToken, roleId, userId
- Four role IDs (1, 2, 3, 4) are the complete set for this phase
- Role IDs 1 and 2 both route to the same admin module (not separate destinations)
- Target modules (admin, member, manager) exist and are accessible at predictable routes
- Backend manages cookie lifecycle (sets cookies with appropriate flags during login, clears during logout)
- HTTPS is enforced for login and all authenticated routes (cookies Secure flag requires HTTPS)
- Session timeout is set to 30 minutes; refresh token validity extends beyond this for session extension
- Frontend framework has router guards capability (Angular, React Router, etc.)
ng correctly
- Requires admin, member, and manager modules to be built and accessible
- Login page styling should follow the existing design system of the shell application
- Authentication state must persist across page reloads and browser refresh
- Frontend router must support guards/interceptors for role-based access control
- Backend must support refresh token mechanism for automatic session extension
- Cookie domain must match frontend domain (same-origin requests)
- All authenticated routes must accept Authorization via Cookie headerteng correctly
- Requires admin, member, and manager modules to be built and accessible
- Login page styling should follow the existing design system of the shell application
- Authentication state must persist across page reloads within a session

## Out of Scope

- Password reset or account recovery flows
- User registration or account creation
- Two-factor authentication or multi-factor authentication
- Remember me / "keep me logged in" functionality
- Social login integration (OAuth, SAML, etc.)
- Audit logging of login attempts
- IP-based access restrictions
