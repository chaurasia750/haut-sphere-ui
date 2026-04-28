# Contract: Shell API (Shell ↔ Remotes)

**Phase 1 Output** | **Date**: 2026-04-29 | **Related Plan**: [plan.md](plan.md)

## Overview

Remotes communicate with shell via Angular injectable services (dependency injection) and HTTP APIs. This contract specifies the public interfaces remotes must consume.

---

## 1. AuthService (DI Interface)

### Location
**File**: `apps/shell/src/app/core/auth/auth.service.ts`

### Public API

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Get current authentication token.
   * @returns Observable<string> - Bearer token
   */
  getToken(): Observable<string>;

  /**
   * Get current authenticated user.
   * @returns Observable<User> - User object or null if not authenticated
   */
  getUser(): Observable<User | null>;

  /**
   * Authenticate with credentials.
   * @param credentials - Login credentials
   * @returns Observable<User> - Authenticated user object
   */
  login(credentials: LoginCredentials): Observable<User>;

  /**
   * Refresh authentication token.
   * @returns Observable<string> - New token
   */
  refreshToken(): Observable<string>;

  /**
   * Clear authentication and logout user.
   * @returns void
   */
  logout(): void;

  /**
   * Check if user is authenticated.
   * @returns Observable<boolean> - True if authenticated
   */
  isAuthenticated(): Observable<boolean>;

  /**
   * Check if user has a specific role.
   * @param role - Role name
   * @returns Observable<boolean> - True if user has role
   */
  hasRole(role: string): Observable<boolean>;
}
```

### Usage in Remote

**Example** (Admin component):

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shell/core/auth';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user$ | async as user">
      <h1>{{ user.username }}</h1>
      <p>Roles: {{ user.roles.join(', ') }}</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  user$ = this.auth.getUser();

  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
```

### Implementation Notes

- `getToken()` returns Observable for reactive updates
- Token stored in HttpOnly cookie; JS code receives it as string
- Token automatically added to all HTTP requests via shell interceptor
- Remotes should NOT manually add `Authorization` header
- Token expiry triggers automatic refresh via shell interceptor

---

## 2. Shell State API (HTTP)

### Base URL
```
http://localhost:4200/api/shell
```

### Endpoints

#### GET /api/shell/state

**Purpose**: Retrieve non-business shell state (theme, locale, preferences).

**Response**:
```json
{
  "theme": "light",
  "locale": "en",
  "sidebarCollapsed": false,
  "userPreferences": {
    "compactMode": false,
    "notificationsEnabled": true
  }
}
```

**Status Codes**:
- `200 OK` - State retrieved successfully
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Server error

**Example Usage**:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ShellStateService {
  constructor(private http: HttpClient) {}

  getShellState() {
    return this.http.get('/api/shell/state');
  }
}
```

#### PUT /api/shell/state

**Purpose**: Update shell state (e.g., user changes theme).

**Request Body**:
```json
{
  "theme": "dark",
  "locale": "es",
  "sidebarCollapsed": true,
  "userPreferences": {
    "compactMode": true,
    "notificationsEnabled": false
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "State updated"
}
```

**Status Codes**:
- `200 OK` - State updated successfully
- `400 Bad Request` - Invalid state object
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Server error

**Example Usage**:

```typescript
updateShellState(state: any) {
  return this.http.put('/api/shell/state', state);
}
```

#### GET /api/shell/user

**Purpose**: Fetch current authenticated user (alternative to AuthService).

**Response**:
```json
{
  "id": "user-123",
  "username": "johndoe",
  "email": "john@example.com",
  "roles": ["admin", "member"]
}
```

**Status Codes**:
- `200 OK` - User fetched successfully
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

**Example Usage**:

```typescript
getUser() {
  return this.http.get('/api/shell/user');
}
```

---

## 3. Error Handling Interceptor (Shell Core)

Remotes automatically benefit from shell's HTTP interceptor, which:

1. **Adds authentication header** to all requests:
   ```
   Authorization: Bearer [token]
   ```

2. **Handles 401 Unauthorized** by refreshing token or redirecting to login

3. **Logs errors to observability** (Sentry, etc.)

4. **Adds request ID** for tracing:
   ```
   X-Request-ID: [uuid]
   ```

### HTTP Error Handling

If an API call fails, remote should handle error gracefully:

```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

this.http.get('/api/users').pipe(
  catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      // Unauthorized; shell interceptor will redirect
    } else if (error.status === 403) {
      // Forbidden
    } else if (error.status >= 500) {
      // Server error
    }
    throw error;
  })
).subscribe();
```

---

## 4. Navigation & Routing (Shell Router)

### Shell Router Injection

Remotes can inject `Router` (from `@angular/router`) to navigate:

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigate() {
  // Navigate within remote's routes
  this.router.navigate(['/users', 'detail', userId]);

  // Navigate to another remote (shell handles routing)
  this.router.navigate(['/admin', 'dashboard']);
  // or
  this.router.navigate(['/member', 'profile']);
}
```

### Cross-App Navigation

When navigating to another remote from within a remote:

```typescript
// From admin remote to member remote
this.router.navigate(['/member', 'profile']);

// Shell intercepts this route change and loads member remote
```

---

## 5. Authentication Flow

### Automatic Token Refresh

Shell's HTTP interceptor automatically handles token expiry:

1. Request sent with token
2. If response is `401 Unauthorized`:
   - Interceptor calls `AuthService.refreshToken()`
   - Original request is retried with new token
   - If refresh fails, user redirected to login

Remotes don't need to handle token refresh manually.

### Login/Logout Flow

**Login**:
```typescript
this.auth.login(credentials).subscribe({
  next: (user) => {
    console.log('Logged in as', user.username);
    this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    console.error('Login failed', err);
  }
});
```

**Logout**:
```typescript
this.auth.logout();
// Shell clears tokens and redirects to login page
```

---

## 6. Guards (Shell Provided)

Shell provides route guards that remotes can use:

### AuthGuard

Prevents access to protected routes if user not authenticated.

```typescript
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
```

**Usage** (in remote routing):

```typescript
const routes: Routes = [
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
```

### RoleGuard

Restricts access based on user role.

```typescript
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    return auth.hasRole(requiredRole);
  };
};
```

**Usage**:

```typescript
{
  path: 'admin/users',
  component: UsersComponent,
  canActivate: [roleGuard('admin')],
}
```

---

## Summary

| Interface | Type | Purpose |
|-----------|------|---------|
| **AuthService** | DI Service | Get/refresh tokens, manage login/logout |
| **GET /api/shell/state** | HTTP | Fetch theme, locale, preferences |
| **PUT /api/shell/state** | HTTP | Update theme, locale, preferences |
| **GET /api/shell/user** | HTTP | Fetch current user (alternative to AuthService) |
| **Router** | DI Service | Navigate between routes (shell handles routing) |
| **authGuard** | Route Guard | Protect routes; require authentication |
| **roleGuard** | Route Guard | Protect routes; require specific role |
| **HTTP Interceptor** | Shell Core | Auto-attach auth headers, refresh tokens, log errors |

---

(End of shell API contract)
