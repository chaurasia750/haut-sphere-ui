# Research: Role-Based Login

**Feature**: Role-Based Login | **Branch**: `003-role-based-login` | **Date**: 2026-04-30

## Executive Summary

This research resolves all technical ambiguities identified during specification clarification. All decisions have been validated against the project's Angular Nx monorepo architecture and HTTP security best practices.

---

## R1: Authentication Service Architecture

### Decision

Use a centralized authentication service located in `libs/shared/auth` that manages:
1. Login credential submission via HTTP POST to backend `/auth/login`
2. Token storage lifecycle (httpOnly cookies via backend Set-Cookie headers)
3. Session validation on protected routes (router guards)
4. Automatic token refresh via refresh token exchange

### Rationale

- **Centralization**: Follows the constitution's principle II (Library-First Reuse). All auth logic in one library prevents duplication across shell and remote modules.
- **Security**: httpOnly cookies prevent XSS token theft. Backend Set-Cookie headers ensure tokens are never exposed to JavaScript.
- **Automatic Transmission**: Cookies are automatically sent by the browser on all same-origin requests; no manual header injection needed.
- **Monorepo Pattern**: Consistent with existing Haut Spare UI module federation architecture where shell is the auth authority.

### Validation

✅ Aligns with Angular best practices (services for cross-cutting concerns)
✅ Matches constitution governance (centralized in shell, delegated to shared library)
✅ Compatible with existing RxJS + HttpClient patterns in monorepo

---

## R2: HTTP Cookie Configuration

### Decision

Backend must set cookies with these flags on successful authentication:

```
Set-Cookie: accessToken=<value>; HttpOnly; Secure; SameSite=Strict; Max-Age=1800; Path=/
Set-Cookie: refreshToken=<value>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/
```

- **HttpOnly=true**: Prevents JavaScript access (mitigates XSS)
- **Secure=true**: Cookies only sent over HTTPS (mitigates MITM)
- **SameSite=Strict**: Prevents CSRF attacks (cookies not sent on cross-site requests)
- **Max-Age**: accessToken = 1800s (30 min), refreshToken = 604800s (7 days)

### Rationale

- **Security First**: httpOnly + Secure + SameSite covers OWASP top auth vulnerabilities
- **Session Duration**: 30-minute access token balances security (quick expiry) with UX (no frequent re-login)
- **Refresh Token**: 7-day refresh token enables seamless session extension without re-entering password
- **Automatic Transmission**: Cookies sent by browser automatically; frontend doesn't manage tokens explicitly

### Validation

✅ Follows OWASP secure cookie practices
✅ Compatible with modern browsers (all support SameSite)
✅ HTTPS requirement already enforced in production deployments

---

## R3: Role-Based Routing Decision

### Decision

Implement role-based routing as a router guard chain in the shell app:

1. **Login Route** (`/login`): Publicly accessible
2. **Protected Routes** (`/admin`, `/member`, `/management`): Require valid session + role match
3. **Router Guard** (`RoleGuard`): Validates role on each navigation attempt
4. **Invalid Role Fallback**: Log error server-side, display generic message, redirect to login

**Routing Matrix**:

| Role ID | Destination | Implementation |
|---------|-------------|-----------------|
| 1, 2 | `/admin` | Navigate to remotely-federated admin module |
| 3 | `/member` | Navigate to remotely-federated member module |
| 4 | `/management` | Navigate to remotely-federated management module |
| Unknown | Login | Display error, log event, redirect to `/login` |

### Rationale

- **Constitution Adherence**: Shell owns routing authority (Principle III). Guards validate role before routing.
- **Lazy Loading**: Remote modules loaded only when user navigates to their role-specific route (performance benefit).
- **Separation of Concerns**: Login service handles credentials; router service handles navigation; guard validates permissions.
- **Failure Safety**: Invalid roles never reach remote modules (prevents 404s, leaked information).

### Validation

✅ Matches Haut Spare UI module federation pattern (shell as host, remotes as lazy-loaded features)
✅ Compatible with Angular router guards API
✅ Enables audit logging of role mismatches server-side

---

## R4: Session Timeout & Refresh Token Strategy

### Decision

Implement dual-layer session management:

**Layer 1 - Access Token (Stateless)**:
- 30-minute expiry (as specified)
- Used for API authentication
- Refreshed silently before expiry

**Layer 2 - Refresh Token (Backend-tracked)**:
- 7-day expiry (extends session possibility)
- Stored server-side for invalidation on logout
- Can be revoked if concurrent login detected

**Timeout Behavior**:
- User activity during session → no action needed (token still valid)
- User inactive > 30 min → access token expires, refresh token exchanges for new access token (transparent)
- Refresh token expires → redirect to login with "Session expired" message
- User clicks logout → Both tokens cleared immediately

### Rationale

- **UX**: 30-minute access token minimizes re-auth burden; refresh token enables seamless extension
- **Security**: Access token expiry caps blast radius if leaked; backend tracks refresh tokens for revocation
- **Concurrent Login**: Last-login-wins pattern; previous sessions invalidated by server-side token revocation
- **No Manual Refresh in UI**: Interceptor handles token refresh transparently; users never see 401 → new token → retry flow

### Validation

✅ Aligns with OAuth 2.0 refresh token pattern (industry standard)
✅ Compatible with RxJS interceptor pattern (can handle token refresh transparently)
✅ Meets security goal of session timeout specification

---

## R5: Angular Implementation Patterns

### Decision

Use Angular v21+ native patterns for the login feature:

1. **Reactive Forms** (`ReactiveFormsModule`):
   - Email validation via built-in validators + custom email regex
   - Real-time validation feedback
   - Type-safe form builder with strongly-typed FormGroup

2. **RxJS Operators** for async patterns:
   - `switchMap` for sequential login → routing
   - `tap` for side effects (token storage)
   - `catchError` for error handling
   - `finalize` for UI state reset

3. **HTTP Interceptor** (`HttpInterceptor`):
   - Attach Authorization header if needed (though cookies auto-send)
   - Handle 401 responses (token expired, redirect to login)
   - Log errors for debugging

4. **Router Guards** (`CanActivate`):
   - Check session validity (read-only; don't modify state)
   - Redirect to login if invalid

### Rationale

- **Reactive Forms**: Typed form validation; composable and testable
- **RxJS**: Async handling is idiomatic in Angular; switchMap prevents race conditions (multiple login attempts)
- **Interceptor**: Centralized HTTP error handling
- **Guards**: Declarative route protection; doesn't require manual checks in every component

### Validation

✅ Uses Angular 21+ recommended patterns (Reactive Forms, Standalone Components/Signals if adopted)
✅ Compatible with existing Haut Spare UI codebase (already using RxJS + Reactive Forms)
✅ Testable with Angular testing utilities (TestBed, HttpTestingController)

---

## R6: Error Handling & User Feedback

### Decision

Map backend errors to user-friendly messages:

| Backend Error | Frontend Display | Log Level |
|---------------|-----------------|-----------|
| 401 Unauthorized | "Invalid email or password" | INFO |
| 400 Bad Request | "Please check your email and password" | WARN |
| 500 Server Error | "System unavailable. Please try again later" | ERROR |
| Invalid roleId | "Unable to access system at this time" | ERROR (server-side) |
| Validation (missing field) | Inline form validation feedback | DEBUG |

**Logging Strategy**:
- Client-side: Log form validation errors, auth service state changes (DEBUG level)
- Server-side: Log failed login attempts, invalid role IDs (INFO/ERROR level)
- No sensitive data in logs (passwords, token values)

### Rationale

- **UX**: User-friendly messages don't expose system internals
- **Security**: Generic "unable to access" for invalid roles prevents role discovery attacks
- **Debugging**: Server-side logging enables audit trail and troubleshooting
- **Compliance**: Sensitive data never logged

### Validation

✅ Follows OWASP error handling guidelines
✅ Compatible with existing Sentry integration (if used)
✅ Supports future audit logging requirements

---

## R7: Testing Strategy

### Decision

Implement 3-layer testing pyramid:

**Unit Tests** (auth.service.spec.ts, login.component.spec.ts):
- Test form validation logic (required fields, email format)
- Test auth service login() method with mocked HttpClient
- Test router guard with mocked AuthService
- Test error handling (transform backend errors to user messages)
- Coverage target: >80%

**Integration Tests** (login.integration.spec.ts):
- Test login form submission → auth service → router navigation
- Mock backend API responses (successful login, invalid credentials, server error)
- Verify cookies are NOT accessible from JavaScript (httpOnly validation)
- Verify redirect behavior for each role (1→/admin, 2→/admin, 3→/member, 4→/management)

**E2E Tests** (cypress):
- User flow: Enter credentials → Click login → See redirect to role-specific module
- Error flow: Enter invalid credentials → See error message → Can retry
- Session flow: Log in → Refresh page → Session persists → Navigate to other modules → Still logged in

### Rationale

- **Pyramid Shape**: Unit tests are fast and cheap (most coverage); e2e tests are slow but validate real flows
- **Mock Backend**: Unit/integration tests don't depend on backend availability
- **Cookie Validation**: Verify httpOnly flag actually prevents JavaScript access
- **Role-Based Verification**: Each role is independently tested

### Validation

✅ Compatible with Nx testing infrastructure (Vitest + Cypress)
✅ Enables parallel test execution
✅ Supports CI/CD pipeline requirements (fast feedback)

---

## R8: Security Considerations & OWASP Alignment

### Decision

Implement OWASP Top 10 mitigations for authentication:

| OWASP Risk | Mitigation | Implementation |
|------------|-----------|-----------------|
| **A01: Injection** | Input validation | Reactive Forms validators + backend re-validation |
| **A02: Broken Auth** | httpOnly cookies + refresh tokens | Backend Set-Cookie headers + server-side token validation |
| **A03: Injection** | XSS Prevention | httpOnly cookies prevent token theft; Angular template sanitization |
| **A04: Insecure Design** | Timeout + role validation | 30-min access token; role enum validation (1-4 only) |
| **A07: CSRF** | SameSite cookies | Backend sets SameSite=Strict |
| **A09: Logging** | Audit trail | Server-side logging of auth events + failed role assignments |

**Additional Practices**:
- No plain HTTP (HTTPS enforced)
- No token in URL (cookies only)
- Password never logged or stored in frontend
- Refresh token revocation on logout

### Rationale

- **Defense in Depth**: Multiple layers protect against different attack vectors
- **Industry Standard**: OWASP guidelines are battle-tested
- **Compliance**: Supports future SOC 2 / ISO 27001 audits

### Validation

✅ Aligns with modern web security practices
✅ Compatible with Angular security best practices
✅ Supports enterprise compliance requirements

---

## Conclusion

All clarifications from specification are validated and technically sound:

✅ Session persists via httpOnly cookies (R2, R4)
✅ 30-minute timeout with refresh token extension (R4)
✅ AuthResponse structure: { accessToken, refreshToken, roleId, userId } (R3)
✅ Invalid roles handled gracefully (R3, R6)
✅ httpOnly cookie storage prevents XSS (R2, R8)
✅ Angular/RxJS implementation patterns confirmed (R5)
✅ Testing strategy covers all flows (R7)
✅ OWASP security aligned (R8)

**Ready for Phase 1: Design & Contracts** ✅
