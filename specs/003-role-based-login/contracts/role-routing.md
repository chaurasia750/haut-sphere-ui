# Contract: Role-Based Routing

**Responsibility**: Shell Application  
**Guard**: `RoleGuard` (Angular CanActivate guard)  
**Routes**: `/admin`, `/member`, `/management`  
**Enforcement**: Client-side (frontend router) + Server-side (backend token validation)

## Role-Route Mapping

| Role ID | Role Name | Route | Remote Module | Access Level |
|---------|-----------|-------|---------------|--------------|
| 1 | System Admin | `/admin` | admin (remote) | Full system management |
| 2 | Admin | `/admin` | admin (remote) | Admin dashboard + reports |
| 3 | Member | `/member` | member (remote) | Member profile + content |
| 4 | Manager | `/management` | management (remote) | Team management + metrics |

## Routing Flow

```
User at /login
    │
    └─► Submit credentials
         │
         ▼
    Backend validates
    Returns roleId in AuthResponse
         │
         ▼
    Router navigates to /
    (RoleGuard intercepts)
         │
         ├─ roleId = 1 or 2 ──┐
         ├─ roleId = 3       ├─► RoleGuard checks role
         ├─ roleId = 4       │   Maps to route
         │                   │
         └─────────────────────────────────────┐
                   ▼
         Navigate to role-specific route
         (lazy-load remote module)
                   │
         ┌─────────┼─────────┐
         │         │         │
         ▼         ▼         ▼
      /admin    /member   /management
      (1,2)      (3)       (4)
```

## RoleGuard Implementation Contract

```typescript
// Route guard must:
// 1. Check if user is authenticated (session valid)
// 2. Read roleId from session/storage
// 3. Check if roleId is valid (1-4)
// 4. Check if roleId matches requested route
// 5. Allow or redirect

export class RoleGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // 1. Is user authenticated?
    if (!this.authService.isAuthenticated()) {
      return of(this.router.parseUrl('/login'));
    }

    // 2. Get user role
    const roleId = this.authService.getCurrentRoleId();

    // 3. Is role valid?
    if (![1, 2, 3, 4].includes(roleId)) {
      this.logger.error('Invalid role detected:', roleId);
      return of(this.router.parseUrl('/error/invalid-role'));
    }

    // 4. Does role match route?
    const requiredRole = route.data['requiredRole'];
    if (requiredRole && roleId !== requiredRole) {
      // Example: role 3 trying to access /admin
      return of(this.router.parseUrl('/unauthorized'));
    }

    // 5. Allow navigation
    return of(true);
  }
}
```

## Route Configuration

```typescript
// Shell app-routing.module.ts
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { requiredRole: [1, 2] },  // Allow both admin roles
    loadChildren: () => import('@shell/features/admin').then(m => m.AdminModule)
  },
  {
    path: 'member',
    canActivate: [RoleGuard],
    data: { requiredRole: [3] },
    loadChildren: () => import('@shell/features/member').then(m => m.MemberModule)
  },
  {
    path: 'management',
    canActivate: [RoleGuard],
    data: { requiredRole: [4] },
    loadChildren: () => import('@shell/features/management').then(m => m.ManagementModule)
  },
  {
    path: '',
    redirectTo: '/admin',  // Default route (only accessible after auth)
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'  // Catch-all: redirect to login
  }
];
```

## Session Validation Contract

On each protected route navigation, the guard MUST:

1. **Check Session Exists**: Verify cookies present (via backend API call or token expiry check)
2. **Validate Backend**: Send request to `/api/auth/validate` to confirm session active
3. **Check Role Match**: Ensure roleId from session matches route permission
4. **Handle Expiry**: If access token expired, attempt refresh via `/api/auth/refresh`
5. **Redirect if Invalid**: If session invalid or refresh fails, redirect to `/login` with "Session expired" message

### Validation Endpoint Contract

```
GET /api/auth/validate
Accept: application/json
Cookie: accessToken=<value>; refreshToken=<value>

Response (200 OK):
{
  "isValid": true,
  "roleId": 2,
  "expiresIn": 1795  // Seconds remaining
}

Response (401 Unauthorized):
{
  "isValid": false,
  "message": "Session expired"
}
```

## Error Handling

| Scenario | HTTP Status | Frontend Action | User Message |
|----------|-------------|-----------------|--------------|
| Valid session, role matches route | 200 | Allow navigation | N/A |
| Valid session, role doesn't match route | 403 | Redirect to allowed route | (transparent) |
| Session expired (access token > 30 min) | 401 | Try refresh endpoint | N/A (if refresh succeeds) |
| Refresh token also expired | 401 | Redirect to `/login` | "Session expired. Please log in again." |
| Invalid role (not 1-4) | 400 | Redirect to `/error` | "Unable to access system at this time" |
| No session (no cookies) | 401 | Redirect to `/login` | (transparent for public `/login` route) |

## Cross-Module Navigation

Once user is authenticated and routed to their module, subsequent navigation:

1. **Same Module** (`/admin → /admin/dashboard`): No additional guard check needed
2. **Different Module** (`/admin → /member`): RoleGuard prevents navigation (role 1/2 cannot access member route)
3. **Admin Routes** (`/admin`, `/admin/*`): All accessible to roles 1 and 2
4. **Member Routes** (`/member`, `/member/*`): Only accessible to role 3
5. **Management Routes** (`/management`, `/management/*`): Only accessible to role 4

## Invalid Role Behavior

**Scenario**: Backend returns roleId = 99 (not 1-4)

**Frontend Steps**:
1. AuthResponse received with roleId = 99
2. RoleGuard detects invalid role
3. Log error server-side (audit trail)
4. Display generic message: "Unable to access system at this time"
5. Keep user on login page (don't auto-logout, allow retry)
6. User can retry login or contact support

**Backend Steps**:
1. Investigate why invalid role assigned
2. Fix user role in database
3. Log event for audit

## Concurrent Login Handling

**Scenario**: User logs in from two browsers simultaneously

**Expected Behavior**:
1. First login: Session 1 created with tokens
2. Second login: Session 2 created with new tokens
3. Backend choice: Invalidate Session 1 OR allow both (configurable)
4. If Session 1 invalidated: Browser 1 gets 401 on next request, redirected to `/login`
5. If both allowed: Both sessions remain active independently

**Implementation**: Backend responsibility (token revocation strategy).

## Summary

- **RoleGuard** validates session + role on every protected route navigation
- **Role-to-Route Mapping** is hardcoded (1-2→/admin, 3→/member, 4→/management)
- **No Direct Access**: Invalid roles never reach remote modules
- **Failure Safe**: On any session error, redirect to `/login`
- **Server-Side Validation**: Backend MUST validate roleId independently (never trust frontend)
