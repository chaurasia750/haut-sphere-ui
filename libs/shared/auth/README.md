# Role-Based Login Feature

This feature provides complete authentication and role-based routing functionality.

## Components

### LoginComponent
- **Location**: `src/app/features/login/pages/login/`
- **Purpose**: Main login page with email/password form
- **Features**:
  - Reactive forms with validation
  - Error handling and user-friendly messages
  - Loading state management
  - Accessible form with ARIA labels
  - Responsive design (Tailwind CSS)

## Services

### AuthService
- **Location**: `libs/shared/auth/src/lib/auth.service.ts`
- **Purpose**: Centralized authentication management
- **Features**:
  - User login and logout
  - Session management
  - Token refresh handling
  - Role-based session state

## Guards

### RoleGuard
- **Location**: `src/app/core/guards/auth.guard.ts`
- **Purpose**: Protect routes based on user roles
- **Usage**: Add to route data with roles array
  ```typescript
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { roles: [1, 2] }
  }
  ```

## Role Routing

| Role ID | Description | Route |
|---------|-------------|-------|
| 1 | System Admin | `/admin` |
| 2 | Admin | `/admin` |
| 3 | Member | `/member` |
| 4 | Manager | `/management` |

## Usage

### Basic Setup

1. Import AuthService and guards in your app module:
```typescript
import { AuthService, authGuard } from '@libs/shared/auth';
```

2. Add AuthInterceptor to providers:
```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}
```

3. Configure routes with guards:
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard],
  data: { roles: [1, 2] }
}
```

## API Endpoints

### POST /api/auth/login
Login with credentials
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
Response:
```json
{
  "roleId": 1,
  "userId": "user-id",
  "expiresIn": 1800
}
```
Cookies: `accessToken`, `refreshToken` (httpOnly)

### GET /api/auth/validate
Validate current session

### POST /api/auth/logout
Logout current user

### POST /api/auth/refresh
Refresh access token using refresh token

## Testing

- Unit tests: `npm run test -- @libs/shared/auth`
- Component tests: `npm run test -- shell`
- E2E tests: `npm run e2e shell-e2e`

## Security

- ✅ httpOnly cookies for token storage (XSS protection)
- ✅ SameSite cookie attribute (CSRF protection)
- ✅ Password validation server-side only
- ✅ Role validation on backend
- ✅ Automatic session timeout after 30 minutes
