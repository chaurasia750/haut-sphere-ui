# Data Model: Role-Based Login

**Feature**: Role-Based Login | **Branch**: `003-role-based-login` | **Date**: 2026-04-30

## Domain Entities

### User

Represents a person logging into the system.

**Fields**:
- `email`: string - Unique user identifier; validated against standard email regex
- `password`: string - Plaintext during login form input; never stored in frontend; sent to backend only over HTTPS
- `roleId`: number - Assigned role (1, 2, 3, or 4); determines module routing
- `userId`: string - UUID assigned by backend; used in logs and subsequent API calls

**Constraints**:
- Email must match format: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- roleId must be one of: 1, 2, 3, 4 (enum validation)
- Password minimum 6 characters (backend requirement; frontend doesn't validate length for better UX)
- Both email and password required (non-nullable)

**Lifecycle**:
- Created during login form initialization (empty state)
- Populated from form inputs
- Sent to backend endpoint (credentials only; roleId not sent)
- roleId returned in response; stored in frontend as route guard input
- Cleared from frontend memory on logout

---

### AuthRequest

Represents the payload sent to backend during login.

**Fields**:
- `email`: string - User's email address
- `password`: string - User's plaintext password (transmission over HTTPS only)

**JSON Example**:
```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

**Endpoint**: `POST /auth/login`

**Validation** (frontend):
- email: required, valid format
- password: required, min 1 character (backend enforces stricter rules)

**Security**:
- Always sent over HTTPS
- No caching; new request each attempt
- No logging of credentials

---

### AuthResponse

Represents the backend response after successful authentication.

**Fields**:
- `accessToken`: string - JWT or opaque token (1800s expiry); included in HTTP requests; NOT accessible to JavaScript (httpOnly cookie)
- `refreshToken`: string - JWT or opaque token (604800s expiry); used for session extension; NOT accessible to JavaScript (httpOnly cookie)
- `roleId`: number - One of (1, 2, 3, 4); determines which module user can access
- `userId`: string - Backend-assigned UUID; used in logs and subsequent requests
- `expiresIn`: number - Seconds until access token expires (typically 1800)

**JSON Example**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "roleId": 2,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": 1800
}
```

**HTTP Response Headers**:
```
HTTP/1.1 200 OK
Set-Cookie: accessToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=1800; Path=/
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/
Content-Type: application/json

{ "roleId": 2, "userId": "..." }
```

**Validation** (frontend):
- roleId must be one of (1, 2, 3, 4); if not, treat as invalid role error
- userId must be non-empty string
- expiresIn must be positive integer > 0

**Constraints**:
- Only issued after successful credential verification
- Tokens are cryptographically signed (backend detail; frontend just stores/uses)
- Tokens expire after Max-Age specified in Set-Cookie header

---

### LoginError

Represents errors encountered during login.

**Error Types**:

| Error Type | Code | User Message | HTTP Status | Log Level |
|-----------|------|--------------|-------------|-----------|
| Invalid Credentials | `AUTH_INVALID_CREDS` | "Invalid email or password" | 401 | INFO |
| Malformed Request | `AUTH_BAD_REQUEST` | "Please check your email and password" | 400 | WARN |
| Server Error | `AUTH_SERVER_ERROR` | "System unavailable. Please try again later" | 500+ | ERROR |
| Invalid Role | `AUTH_INVALID_ROLE` | "Unable to access system at this time" | 200 (role not in 1-4) | ERROR |
| Validation Error | `FORM_VALIDATION` | Specific field error inline | N/A | DEBUG |
| Unknown | `AUTH_UNKNOWN` | "An unexpected error occurred" | Other | ERROR |

**Example Structure** (TypeScript):
```typescript
interface LoginError {
  code: string;
  message: string;
  userMessage: string;
  statusCode: number;
  timestamp: Date;
}
```

**Lifecycle**:
- Created from backend error response or form validation
- Displayed to user via form error messages or toast notification
- Cleared when user attempts new login or corrects input

---

### TokenPair

Represents the access + refresh token pair stored in httpOnly cookies.

**Storage Location**: Browser httpOnly Secure cookies (NOT accessible to JavaScript)

**Fields** (logical; not directly accessed in code):
- `accessToken`: string - Sent automatically by browser on all requests to `/admin`, `/member`, `/management`
- `refreshToken`: string - Used by backend to exchange for new accessToken when needed
- `expiresAt`: number - Unix timestamp (calculated from expiresIn on login)

**Cookie Details**:
```
Cookie Name: accessToken
Value: [JWT or opaque token]
HttpOnly: true (prevents document.cookie access)
Secure: true (HTTPS only)
SameSite: Strict (no cross-site transmission)
Max-Age: 1800 (30 minutes)
Path: /

Cookie Name: refreshToken
Value: [JWT or opaque token]
HttpOnly: true
Secure: true
SameSite: Strict
Max-Age: 604800 (7 days)
Path: /
```

**Frontend Interaction**:
- Frontend CANNOT read token values (httpOnly prevents access)
- Frontend CAN detect token presence by attempting protected API call
- Frontend CANNOT set or modify cookies directly (backend owns lifecycle)
- Browser automatically includes cookies on all same-origin requests

**Validation**:
- Token format verified by backend (frontend doesn't parse)
- Expiry verified by browser (Max-Age)
- Revocation checked on backend for each request (session validation)

---

### Role (Enum)

Represents user authorization level.

**Valid Values**:

| Role ID | Name | Module | Responsibilities |
|---------|------|--------|------------------|
| 1 | System Admin | `/admin` | Full system management, user admin, settings |
| 2 | Admin | `/admin` | Dashboard, reports, some configuration |
| 3 | Member | `/member` | Profile, preferences, content access |
| 4 | Manager | `/management` | Team oversight, performance metrics, scheduling |

**TypeScript Enum** (for type safety):
```typescript
export enum RoleId {
  SYSTEM_ADMIN = 1,
  ADMIN = 2,
  MEMBER = 3,
  MANAGER = 4
}

export type ValidRoleId = RoleId.SYSTEM_ADMIN | RoleId.ADMIN | RoleId.MEMBER | RoleId.MANAGER;
```

**Routing Mapping**:
```typescript
const roleRouteMap: Record<ValidRoleId, string> = {
  [RoleId.SYSTEM_ADMIN]: '/admin',
  [RoleId.ADMIN]: '/admin',
  [RoleId.MEMBER]: '/member',
  [RoleId.MANAGER]: '/management'
};
```

**Constraints**:
- Only these 4 roles valid; any other value treated as error
- Role assigned by backend; frontend does not modify
- Role determines which remote module can be accessed

---

### Session

Represents active user session state.

**Fields**:
- `userId`: string - User ID from AuthResponse
- `roleId`: number - Role from AuthResponse; cached for guard validation
- `isAuthenticated`: boolean - true if valid session exists (cookies present and not expired)
- `expiresAt`: number - Unix timestamp of access token expiry
- `lastActivity`: number - Unix timestamp of last user action (used for inactivity timeout)

**Lifecycle**:
1. **Login**: Session created from AuthResponse; tokens stored in cookies by backend
2. **Active**: Session remains valid while access token not expired and refresh token not revoked
3. **Token Refresh**: When access token nears expiry, backend exchanges refresh token for new access token (transparent)
4. **Expired**: When refresh token expires, session invalid; user redirected to login
5. **Logout**: Session cleared; cookies deleted by backend (Set-Cookie with Max-Age=0)

**Example State** (Angular Signal or BehaviorSubject):
```typescript
const sessionSignal = signal<Session>({
  userId: '550e8400-e29b-41d4-a716-446655440000',
  roleId: 2,
  isAuthenticated: true,
  expiresAt: Date.now() + 1800000,
  lastActivity: Date.now()
});
```

---

## Relationships

```
┌─────────────┐
│   User      │
│ (form input)│
└──────┬──────┘
       │ submits credentials
       │
       ▼
┌──────────────────┐
│  AuthRequest     │
│ (POST /auth/login)
└──────────────────┘
       │
       │ sends
       │
       ▼
┌──────────────────────────┐
│  Backend Authentication  │
│  (validates credentials) │
└──────────────────────────┘
       │
       ├─ Success ──────────┐
       │                    │
       ▼                    ▼
┌──────────────────────┐  ┌──────────────┐
│  AuthResponse        │  │  LoginError  │
│ (tokens + roleId)    │  │ (if failed)  │
└──────────────────────┘  └──────────────┘
       │
       │ stores tokens
       │ validates roleId
       │
       ▼
┌────────────────────────────────┐
│  TokenPair (in httpOnly cookies)
│  + Role (determines route)     │
└────────────────────────────────┘
       │
       │ router guard validates
       │
       ▼
┌──────────────────────┐
│  Session             │
│  (authenticated user)│
└──────────────────────┘
       │
       │ role-based routing
       │
       ├─ Role 1 or 2 ──────────────────► `/admin`
       ├─ Role 3 ───────────────────────► `/member`
       └─ Role 4 ───────────────────────► `/management`
```

---

## Validation Rules

### Email Validation
- **Pattern**: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- **Required**: true
- **Error**: "Please enter a valid email"

### Password Validation
- **Required**: true
- **Min Length**: 1 character (frontend); backend enforces stricter rules
- **Error**: "Password is required"

### Role ID Validation
- **Type**: number (enum)
- **Valid Values**: 1, 2, 3, 4 only
- **On Invalid**: Log error server-side, display generic error message to user

### Token Validation
- **Format**: JWT or opaque string (backend validates format)
- **Expiry**: Checked by Max-Age header; browser handles automatically
- **Revocation**: Checked by backend on each request (session store)

---

## State Management Pattern

Use Angular Signals or RxJS BehaviorSubject for session state:

```typescript
// Option 1: Signals (Angular 17+)
export const sessionSignal = signal<Session | null>(null);

// Option 2: RxJS (current approach)
export const session$ = new BehaviorSubject<Session | null>(null);

// Usage
sessionSignal.set(authResponse);
session$.next(authResponse);
```

**Derived Signals/Observables**:
```typescript
export const isAuthenticated$ = session$.pipe(map(s => s !== null));
export const userRole$ = session$.pipe(map(s => s?.roleId));
export const isExpired$ = session$.pipe(map(s => s && s.expiresAt < Date.now()));
```

---

## Summary

| Entity | Purpose | Storage | Lifetime |
|--------|---------|---------|----------|
| User | Login form inputs | Frontend component | During form submission |
| AuthRequest | Backend API payload | HTTP request body | Single request |
| AuthResponse | Backend login response | Parsed once, then discarded | Response processing only |
| TokenPair | Session authentication | httpOnly cookies (browser) | Until expiry or logout |
| LoginError | Error feedback | Frontend component state | Until user corrects input |
| Role | Authorization level | AuthResponse + cached in guard | Until logout or refresh |
| Session | Active user state | Frontend BehaviorSubject/Signal | Until logout or expiry |

**Key Principle**: Tokens are NEVER stored in JavaScript-accessible storage (localStorage, memory, state). httpOnly cookies handle all storage and transmission automatically.
