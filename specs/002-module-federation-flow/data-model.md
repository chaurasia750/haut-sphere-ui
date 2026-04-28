# Data Model: Module Federation Flow – Micro Frontend

**Session**: April 29, 2026 | **Spec**: [spec.md](spec.md) | **Research**: [research.md](research.md)

---

## Overview

This document defines the core entities, types, and state management patterns for the Module Federation architecture. It establishes the contracts between Shell and remotes.

---

## Core Entities

### 1. Remote Application Configuration

**Entity**: `RemoteConfig`

**Purpose**: Defines a remote application that Shell can load dynamically.

**Properties**:

```typescript
interface RemoteConfig {
  // Unique identifier for the remote
  key: string;          // e.g., 'admin', 'member', 'management'
  
  // Entry point for dynamic import
  entry: string;        // e.g., 'http://localhost:4101/remoteEntry.js'
  
  // Exposed module name
  exposedModule: string; // e.g., './Module' (what remote exposes)
  
  // Route this remote is mounted on
  route: string;        // e.g., '/admin', '/member', '/management'
  
  // Display name for UI
  displayName: string;  // e.g., 'Admin Portal'
  
  // Whether to preload (default false for lazy loading)
  preload?: boolean;    // false by default (lazy loading)
  
  // Load timeout in ms
  loadTimeout?: number; // default 5000ms
  
  // Metadata for future extensibility
  metadata?: Record<string, any>;
}
```

**Relationships**:
- One RemoteConfig per remote application
- Configuration stored in environment-specific files (`remotes.dev.config.ts`, etc.)
- Shell maintains registry of all RemoteConfigs

**Constraints**:
- `key` must be unique and URL-safe (no spaces, special chars)
- `entry` must be valid HTTPS URL in production (HTTP allowed in dev)
- `route` must start with `/` and be unique
- `loadTimeout` must be > 1000ms (minimum 1 second)

**Example**:
```typescript
{
  key: 'admin',
  entry: 'http://localhost:4101/remoteEntry.js',
  exposedModule: './Module',
  route: '/admin',
  displayName: 'Admin Portal',
  loadTimeout: 5000
}
```

---

### 2. Remote Metadata

**Entity**: `RemoteMetadata`

**Purpose**: Runtime metadata about loaded remote.

**Properties**:

```typescript
interface RemoteMetadata {
  // Remote key
  key: string;
  
  // Current load state
  state: 'idle' | 'loading' | 'loaded' | 'error' | 'unloaded';
  
  // Loaded component (if state === 'loaded')
  component?: any;
  
  // Error message (if state === 'error')
  error?: string;
  
  // Load start timestamp
  loadStartTime?: number;
  
  // Load end timestamp
  loadEndTime?: number;
  
  // Load duration in ms
  loadDuration?: number;
  
  // Bundle size in bytes (for monitoring)
  bundleSize?: number;
}
```

**Relationships**:
- Created when remote begins loading
- Updated throughout lifecycle (loading → loaded → unloaded)
- Used for monitoring and error handling

---

### 3. Authentication State

**Entity**: `AuthState`

**Purpose**: Centralized authentication state maintained by Shell, accessible to remotes.

**Properties**:

```typescript
interface AuthState {
  // Whether user is authenticated
  isAuthenticated: boolean;
  
  // Current user information
  user?: {
    id: string;
    email: string;
    name: string;
    roles: string[];        // e.g., ['admin', 'user']
    permissions: string[];  // e.g., ['read:users', 'write:users']
  };
  
  // Authentication token (JWT or session ID)
  token?: string;
  
  // Token expiration timestamp
  tokenExpiresAt?: number;
  
  // Authentication method used
  authMethod?: 'local' | 'oauth' | 'saml' | 'ldap';
}
```

**Relationships**:
- Maintained in Shell's core auth service
- Shared with remotes via auth library
- Updated on login/logout
- Accessible via `AuthService` (injectable)

**Constraints**:
- Token must be valid before use
- Roles and permissions must be validated by remotes
- AuthState is read-only to remotes (only Shell can modify)

---

### 4. Remote Load Request

**Entity**: `RemoteLoadRequest`

**Purpose**: Request to load a remote application.

**Properties**:

```typescript
interface RemoteLoadRequest {
  // Which remote to load
  remoteKey: string;
  
  // Route parameters (if any)
  params?: Record<string, any>;
  
  // Query parameters
  query?: Record<string, any>;
  
  // Optional auth context (for authorization checks)
  authContext?: AuthState;
  
  // Timeout for this load
  timeout?: number;
  
  // Callback on success
  onSuccess?: (component: any) => void;
  
  // Callback on error
  onError?: (error: Error) => void;
}
```

**Relationships**:
- Triggered by Shell router when user navigates to remote route
- Creates RemoteMetadata entry
- Checked against AuthState for authorization

---

### 5. Error Handling

**Entity**: `RemoteError`

**Purpose**: Structured error when remote fails to load or execute.

**Properties**:

```typescript
interface RemoteError extends Error {
  // Error type
  type: 'network' | 'bundle-mismatch' | 'version-conflict' | 'unauthorized' | 'timeout' | 'runtime';
  
  // Remote key that failed
  remoteKey: string;
  
  // Original error
  originalError: Error;
  
  // Whether error is recoverable
  recoverable: boolean;
  
  // Suggested action
  suggestedAction?: 'retry' | 'navigate-elsewhere' | 'refresh' | 'contact-support';
  
  // Timestamp of error
  timestamp: number;
  
  // Additional context
  context?: Record<string, any>;
}
```

**Usage**:
- Caught by Shell's error handler
- Displayed to user with recovery options
- Logged for monitoring/debugging

---

## Type Definitions

### Navigation Types

```typescript
// Route parameter type for remote routes
interface RemoteRouteParams {
  remote: string;  // e.g., 'admin'
  [key: string]: any;
}

// Shell route metadata
interface ShellRouteMetadata {
  title: string;
  remoteKey?: string;    // if this route loads a remote
  requiresAuth?: boolean;
  roles?: string[];      // required roles to access
}
```

### Loading States

```typescript
// Possible states of remote loading process
type RemoteLoadState = 
  | 'idle'        // Not loaded, not loading
  | 'loading'     // Fetching/initializing remote
  | 'loaded'      // Ready to render
  | 'error'       // Failed to load
  | 'unloaded';   // Loaded previously, now unloaded

// UI state for displaying remote
type RemoteUIState =
  | 'hidden'      // Remote not visible
  | 'loading'     // Show loading spinner
  | 'visible'     // Render remote
  | 'error'       // Show error message
  | 'unauthorized'; // Show access denied message
```

### Service Interfaces

```typescript
// Remote loader service interface
interface IRemoteLoader {
  // Load a remote and return its component
  load(config: RemoteConfig): Promise<any>;
  
  // Unload a previously loaded remote
  unload(key: string): Promise<void>;
  
  // Get metadata for a remote
  getMetadata(key: string): RemoteMetadata | undefined;
}

// Auth service interface (shared)
interface IAuthService {
  // Get current auth state
  getAuthState(): Observable<AuthState>;
  
  // Check if user has role
  hasRole(role: string): boolean;
  
  // Check if user has permission
  hasPermission(permission: string): boolean;
  
  // Logout user
  logout(): Observable<void>;
}

// Error handler service interface (shared)
interface IErrorHandler {
  // Handle a remote error
  handle(error: RemoteError): void;
  
  // Show error UI
  showErrorMessage(message: string, recoverable?: boolean): void;
}
```

---

## State Management Pattern

### RxJS-Based State Management (Recommended)

**Shell State (Observable-based)**:

```typescript
export class ShellState {
  // Remote configurations
  private remoteConfigs$ = new BehaviorSubject<RemoteConfig[]>([]);
  
  // Currently loaded remote metadata
  private loadedRemotes$ = new BehaviorSubject<Map<string, RemoteMetadata>>(new Map());
  
  // Current route
  private currentRoute$ = new BehaviorSubject<string>('/');
  
  // Auth state (from auth service)
  private authState$ = this.authService.getAuthState();
  
  // Expose as observables for components to subscribe
  remoteConfigs = this.remoteConfigs$.asObservable();
  loadedRemotes = this.loadedRemotes$.asObservable();
  currentRoute = this.currentRoute$.asObservable();
  authState = this.authState$;
}
```

**Remote State (Independent)**:

Each remote maintains its own state independently:
- Admin maintains: user list, settings, etc.
- Member maintains: member profile, preferences, etc.
- Management maintains: operational data, reports, etc.

**No cross-remote state sharing** (microservices principle).

---

## Data Flow Diagram

```
User navigates to /admin
       ↓
Shell Router matches /admin
       ↓
Check AuthState (is user authenticated & authorized?)
       ↓
If authorized:
  - Create RemoteLoadRequest
  - RemoteLoader fetches remoteEntry.js
  - Create RemoteMetadata with 'loading' state
  - Render loading indicator
       ↓
  - Remote initializes (loads styles, services, components)
  - RemoteMetadata updated to 'loaded'
  - Render remote component
       ↓
  - User interacts with remote
  - Remote maintains own state independently
       ↓
User navigates to /member
       ↓
Shell unloads admin remote:
  - Destroy Admin component
  - Clear observables & services
  - RemoteMetadata updated to 'unloaded'
       ↓
Load member remote (repeat process)
       ↓
If unauthorized:
  - RemoteMetadata marked 'error'
  - Show unauthorized message
```

---

## Database/Persistence Considerations

**Note**: This is a frontend-only micro frontend architecture. No database considerations at Shell level.

**Per-Remote Persistence**:
- Admin remote: API calls to backend admin API
- Member remote: API calls to backend member API  
- Management remote: API calls to backend management API
- All HTTP handled through injectable services with auth interceptor

**Local Storage**:
- Auth tokens can be stored in localStorage (handled by auth service)
- Sensitive data must NOT be stored locally
- SessionStorage for temporary data only

---

## Validation Rules

### RemoteConfig Validation
- `key`: alphanumeric + hyphens only; 1-50 chars
- `entry`: valid HTTPS URL (HTTP allowed in dev)
- `route`: must start with `/`; unique per app
- `displayName`: 1-100 chars
- `loadTimeout`: 1000-30000 ms

### AuthState Validation
- `user.roles`: must be non-empty array if authenticated
- `token`: must be present if authenticated
- `tokenExpiresAt`: must be in future if present

### RemoteError Validation
- `type`: must be one of allowed types
- `remoteKey`: must reference configured remote
- `recoverable`: must be boolean

---

## Extension Points

### Adding Custom Remote Metadata
```typescript
interface ExtendedRemoteMetadata extends RemoteMetadata {
  // Custom fields per remote
  customField?: any;
}
```

### Adding Custom Auth Context
```typescript
interface ExtendedAuthState extends AuthState {
  // Custom claims
  customClaims?: Record<string, any>;
}
```

---

## Document References

- **Specification**: [spec.md](spec.md)
- **Research**: [research.md](research.md)
- **Plan**: [plan.md](plan.md)
- **Contracts**: [contracts/](contracts/)
- **Quickstart**: [quickstart.md](quickstart.md)

