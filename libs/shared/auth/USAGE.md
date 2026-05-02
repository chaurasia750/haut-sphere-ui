# Authentication Library

**@libs/shared/auth** - Centralized authentication and session management library

## Features

- User authentication with email/password
- Session management with token handling
- Role-based access control
- HTTP interceptor for token management
- Secure httpOnly cookie support
- Session validation and token refresh
- Error handling with user-friendly messages

## Installation

Already included in the monorepo. Import from `@libs/shared/auth`:

```typescript
import { AuthService, authGuard, RoleId } from '@libs/shared/auth';
```

## Quick Start

### 1. Setup Interceptor

Add the AuthInterceptor to your app configuration:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@libs/shared/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    httpClientProvider(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
```

### 2. Setup Routes with Guards

```typescript
import { authGuard, RoleId } from '@libs/shared/auth';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN] }
  },
  {
    path: 'member',
    component: MemberComponent,
    canActivate: [authGuard],
    data: { roles: [RoleId.MEMBER] }
  }
];
```

### 3. Use AuthService in Components

```typescript
import { AuthService } from '@libs/shared/auth';

export class MyComponent implements OnInit {
  isAuthenticated$ = this.authService.getSession$();
  userRole$ = this.authService.getSession$().pipe(
    map(session => session?.roleId)
  );

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
```

## Public API

### AuthService

```typescript
class AuthService {
  login(email: string, password: string): Observable<AuthResponse>;
  logout(): Observable<void>;
  getSession$(): Observable<Session | null>;
  isAuthenticated(): boolean;
  getCurrentRole(): ValidRoleId | null;
  getCurrentUserId(): string | null;
}
```

### Types

```typescript
enum RoleId {
  SYSTEM_ADMIN = 1,
  ADMIN = 2,
  MEMBER = 3,
  MANAGER = 4
}

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  roleId: ValidRoleId;
  userId: string;
  expiresIn: number;
}

interface Session {
  userId: string;
  roleId: ValidRoleId;
  isAuthenticated: boolean;
  expiresAt: number;
  lastActivity: number;
}
```

### Functions

```typescript
function isValidRole(role: unknown): role is ValidRoleId;
```

## API Contracts

### Login Endpoint
- **Path**: POST `/api/auth/login`
- **Body**: `{ email: string, password: string }`
- **Response**: `{ roleId: number, userId: string, expiresIn: number }`
- **Cookies**: Sets httpOnly `accessToken` and `refreshToken`

### Validate Endpoint
- **Path**: GET `/api/auth/validate`
- **Response**: Same as login response
- **Purpose**: Restore session on app initialization

### Logout Endpoint
- **Path**: POST `/api/auth/logout`
- **Response**: 200 OK
- **Purpose**: Clear session server-side

### Refresh Endpoint
- **Path**: POST `/api/auth/refresh`
- **Response**: `{ accessToken: string, expiresIn: number }`
- **Purpose**: Get new access token using refresh token

## Error Handling

Login errors are mapped to user-friendly messages:

- **401**: "Invalid email or password"
- **400**: "Please check your email and password"
- **500+**: "System unavailable. Please try again later"
- **Invalid Role**: "Unable to access system at this time"

## Security Features

✅ **Token Security**
- Tokens stored in httpOnly cookies (inaccessible to JavaScript)
- Secure flag: cookies only sent over HTTPS
- SameSite attribute: prevents CSRF attacks
- 30-minute access token expiry
- 7-day refresh token expiry

✅ **Route Protection**
- All protected routes require authentication
- Role validation before accessing resources
- Automatic redirect to login on 401 response
- Unauthorized users redirected to error page

✅ **Data Protection**
- Passwords never logged or stored
- Role validation on backend
- Session timeout enforcement
- Invalid role detection

## Testing

```bash
# Unit tests
npm run test -- @libs/shared/auth

# With coverage
npm run test -- @libs/shared/auth --coverage
```

## Migration Guide

If upgrading from a previous auth implementation:

1. Replace old AuthService with new one
2. Update route configuration to use authGuard
3. Update component imports to use @libs/shared/auth
4. Ensure HTTP interceptor is registered
5. Run tests: `npm run test`
