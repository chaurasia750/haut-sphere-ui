# Shell (Host) Contract

**Version**: 1.0 | **Date**: April 29, 2026 | **Status**: Locked

---

## Overview

This document defines the public interface (contract) that Shell exposes to remote applications. Remotes depend on these services and behaviors for proper functioning.

---

## Service: AuthService

**Location**: `libs/shared/auth/` | **Exported**: Yes

**Purpose**: Provides authentication state and guards to remotes.

### Public API

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Get current authentication state
   * Returns Observable that emits whenever auth state changes
   * (login, logout, token refresh, etc.)
   */
  getAuthState(): Observable<AuthState> { ... }
  
  /**
   * Check if user has a specific role
   * Synchronous check; use after subscribing to getAuthState()
   */
  hasRole(role: string): boolean { ... }
  
  /**
   * Check if user has a specific permission
   * Synchronous check; use after subscribing to getAuthState()
   */
  hasPermission(permission: string): boolean { ... }
  
  /**
   * Get current user synchronously (may be undefined)
   */
  getCurrentUser(): AuthState['user'] | undefined { ... }
  
  /**
   * Get current auth token
   */
  getToken(): string | undefined { ... }
  
  /**
   * Logout the user
   * Remotes should listen for logout and clean up their state
   */
  logout(): Observable<void> { ... }
}
```

### Usage in Remote

```typescript
import { AuthService } from '@libs/shared/auth';

@Component({...})
export class AdminComponent implements OnInit {
  authState$ = this.authService.getAuthState();
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    // Check if user has admin role
    if (!this.authService.hasRole('admin')) {
      // Redirect to unauthorized
    }
  }
}
```

---

## Service: ErrorHandler Service

**Location**: `libs/shared/errors/` | **Exported**: Yes

**Purpose**: Centralized error handling and display for remotes.

### Public API

```typescript
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  /**
   * Handle a remote error
   * Displays error UI, logs error, handles recovery options
   */
  handle(error: RemoteError): void { ... }
  
  /**
   * Show error message to user
   * Simple API for displaying errors
   */
  showError(message: string, severity?: 'info' | 'warning' | 'error'): void { ... }
  
  /**
   * Get error as Observable (for listening to error events)
   */
  errors$(): Observable<RemoteError> { ... }
}
```

### Usage in Remote

```typescript
import { ErrorHandlerService } from '@libs/shared/errors';

@Component({...})
export class AdminComponent {
  constructor(private errorHandler: ErrorHandlerService) {}
  
  loadUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => this.errorHandler.handle({
        type: 'runtime',
        remoteKey: 'admin',
        originalError: error,
        recoverable: true,
        suggestedAction: 'retry'
      })
    );
  }
}
```

---

## Service: LoggingService

**Location**: `libs/shared/logging/` | **Exported**: Yes

**Purpose**: Centralized logging for all apps.

### Public API

```typescript
@Injectable({ providedIn: 'root' })
export class LoggingService {
  /**
   * Log debug message
   */
  debug(message: string, context?: any): void { ... }
  
  /**
   * Log info message
   */
  info(message: string, context?: any): void { ... }
  
  /**
   * Log warning message
   */
  warn(message: string, context?: any): void { ... }
  
  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: any): void { ... }
}
```

### Usage in Remote

```typescript
import { LoggingService } from '@libs/shared/logging';

@Injectable()
export class UserService {
  constructor(private logger: LoggingService) {}
  
  loadUser(id: string) {
    this.logger.info(`Loading user: ${id}`);
    // ... load logic
  }
}
```

---

## Angular Route Guards

**Location**: `libs/shared/auth/guards/` | **Exported**: Yes

**Purpose**: Protect routes in remotes based on auth state.

### Available Guards

```typescript
/**
 * Guard: Requires user to be authenticated
 * Redirects to login if not authenticated
 */
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree { ... }
}

/**
 * Guard: Requires user to have specific role(s)
 * Redirects to unauthorized if missing role
 */
export class RoleGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree { ... }
}

/**
 * Guard: Requires user to have specific permission(s)
 * Redirects to unauthorized if missing permission
 */
export class PermissionGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree { ... }
}
```

### Usage in Remote

```typescript
// In admin remote routing
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  }
];
```

---

## Shared Types

**Location**: `libs/shared/types/` | **Exported**: Yes

All remotes have access to shared types:

```typescript
// Authentication types
interface AuthState { ... }
interface User { ... }

// Error types
interface RemoteError { ... }
interface RemoteErrorResponse { ... }

// API response types
interface ApiResponse<T> { ... }
interface ApiError { ... }

// Common types
interface Paginated<T> { ... }
interface Filter { ... }
interface SortOptions { ... }
```

---

## HTTP Interceptor

**Location**: `libs/shared/auth/interceptors/` | **Exported**: Yes

**Purpose**: Automatically adds auth token to all HTTP requests.

### Behavior

1. All HTTP requests are intercepted
2. Auth token is added to `Authorization: Bearer <token>` header
3. If token is expired, refresh is attempted (if token has refresh mechanism)
4. If refresh fails or no token, request proceeds (API returns 401, which should trigger logout)
5. 401 responses trigger logout and redirect to login

### Usage

The interceptor is automatically applied to all HTTP calls made through Angular's HttpClient:

```typescript
// In remote component
constructor(private http: HttpClient) {}

getUsers() {
  // Auth token automatically added by interceptor
  return this.http.get('/api/users');
}
```

---

## Layout & Navigation Contract

**Shell Provides**:
- Header with navigation menu
- Sidebar with app menu (if applicable)
- Footer with version info
- Logout button

**Remotes Must**:
- NOT override header/footer
- Respect Shell's navigation structure
- Use Shell's logout button (don't implement separate logout)
- Render within Shell's `<router-outlet>`

---

## Lifecycle Hooks

**Shell will trigger these events that remotes should listen to**:

### OnRemoteInit
Fired when remote is loaded and ready to render.

```typescript
// Remote can listen:
this.shell.remoteInitialized$.subscribe(() => {
  console.log('I am initialized and visible');
});
```

### OnRemoteDestroy
Fired when remote is about to be unloaded.

```typescript
// Remote should clean up:
this.shell.remoteDestroying$.subscribe(() => {
  // Clean up subscriptions, timers, listeners
  this.subscriptions.unsubscribe();
});
```

### OnAuthStateChange
Fired when user's authentication state changes (login, logout, token refresh).

```typescript
this.auth.getAuthState().subscribe(state => {
  if (!state.isAuthenticated) {
    // User logged out, clean up
  }
});
```

---

## Error Handling Contract

**When remote fails to load**:
- Shell will NOT crash
- Shell will show error message to user
- User can retry or navigate to another remote

**When remote throws unhandled error**:
- Error boundary catches it
- Error is logged (centrally)
- User sees error message
- Shell remains functional

---

## Performance Expectations

**Performance guarantees from Shell**:
- Remote entry points loaded from configured URLs
- Remote bundles lazy-loaded on route navigation
- No unnecessary re-renders of Shell when remote loads
- Shell cleanup (unload) completed within 100ms

**Performance expectations of remotes**:
- Must be runnable within 1 second after entry point loads
- Should not block Shell's main thread during initialization
- Must clean up all resources when unloaded

---

## Breaking Changes

**Shell will notify remotes if**:
- Auth service API changes (major version bump)
- Error handling API changes (major version bump)
- Shared types change (with deprecation notice)
- HTTP interceptor behavior changes (with deprecation notice)

**Remotes should**:
- Pin dependency versions to major version
- Test against new Shell versions before upgrading
- Provide feedback if breaking changes are problematic

---

## Support & Communication

- **Issues**: Report to Shell team via GitHub issues (specify remote + error)
- **Questions**: Use project wiki or Slack channel
- **Breaking Changes**: Announced via email + wiki before rollout
- **Backward Compatibility**: Shell maintains N-1 version compatibility

---

## Document References

- **Specification**: [../spec.md](../spec.md)
- **Data Model**: [../data-model.md](../data-model.md)
- **Remote Contract**: [remote-contract.md](remote-contract.md)
- **Quickstart**: [../quickstart.md](../quickstart.md)

