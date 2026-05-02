# Quickstart: Role-Based Login Implementation

**Feature**: Role-Based Login | **Branch**: `003-role-based-login` | **Date**: 2026-04-30

## 30-Second Summary

Implement a login page in the shell app where users authenticate via email/password, receive httpOnly cookies with tokens, and are automatically routed to their role-specific module (admin for roles 1-2, member for role 3, manager for role 4). Session lasts 30 minutes with automatic token refresh.

---

## What You're Building

```
User Visits Shell App
        ↓
  Is authenticated? NO
        ↓
  Redirect to /login
        ↓
  [User enters email/password]
        ↓
  POST /auth/login
        ↓
  Backend validates + sets httpOnly cookies
        ↓
  Frontend receives roleId
        ↓
  RoleGuard routes to module:
    • Role 1-2 → /admin
    • Role 3   → /member
    • Role 4   → /management
        ↓
  User authenticated, accessing module
```

---

## Project Structure Overview

```
apps/shell/
├── src/app/
│   ├── core/guards/
│   │   └── auth.guard.ts              ← NEW: Role-based route guard
│   ├── features/login/                ← NEW: Login feature
│   │   ├── login.module.ts
│   │   ├── login-routing.module.ts
│   │   ├── pages/login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── services/
│   │       └── login.service.ts
│   └── app-routing.module.ts          ← UPDATED: Add login route
│
libs/shared/auth/
├── src/lib/
│   ├── auth.service.ts                ← UPDATED: Handle refresh tokens
│   ├── auth.interceptor.ts            ← UPDATED: Handle 401 responses
│   ├── models/
│   │   ├── auth-response.model.ts     ← NEW
│   │   ├── auth-request.model.ts      ← NEW
│   │   └── role.enum.ts               ← NEW
│   └── index.ts
```

---

## Conventions & Patterns

| Pattern | Implementation |
|---------|-----------------|
| **Form Validation** | Angular Reactive Forms (FormBuilder, Validators) |
| **HTTP Requests** | RxJS Observables + switchMap for sequential flow |
| **Error Handling** | RxJS catchError; map backend errors to user messages |
| **Session State** | BehaviorSubject<Session> in AuthService |
| **Route Guards** | CanActivate with RoleGuard |
| **Token Storage** | httpOnly cookies (backend-managed; frontend can't read) |
| **Styling** | Tailwind CSS utilities only |
| **Testing** | Vitest (unit), Cypress (e2e) |

---

## Key Files to Create

### 1. Role Enum (`libs/shared/auth/src/lib/models/role.enum.ts`)

```typescript
export enum RoleId {
  SYSTEM_ADMIN = 1,
  ADMIN = 2,
  MEMBER = 3,
  MANAGER = 4
}

export type ValidRoleId = RoleId.SYSTEM_ADMIN | RoleId.ADMIN | RoleId.MEMBER | RoleId.MANAGER;

export function isValidRole(role: unknown): role is ValidRoleId {
  return [1, 2, 3, 4].includes(role as any);
}
```

### 2. Auth Response Model (`libs/shared/auth/src/lib/models/auth-response.model.ts`)

```typescript
import { ValidRoleId } from './role.enum';

export interface AuthResponse {
  roleId: ValidRoleId;
  userId: string;
  expiresIn: number; // seconds
}
```

### 3. Auth Service Update (`libs/shared/auth/src/lib/auth.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AuthResponse } from './models/auth-response.model';
import { RoleId, isValidRole } from './models/role.enum';

export interface Session {
  userId: string;
  roleId: RoleId;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private session$ = new BehaviorSubject<Session | null>(null);
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    this.validateSession();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (!isValidRole(response.roleId)) {
            throw new Error(`Invalid role ID: ${response.roleId}`);
          }
          this.session$.next({
            userId: response.userId,
            roleId: response.roleId,
            isAuthenticated: true
          });
        }),
        catchError((error) => {
          this.session$.next(null);
          throw error;
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.session$.next(null)),
        catchError((error) => {
          this.session$.next(null);
          throw error;
        })
      );
  }

  getSession$(): Observable<Session | null> {
    return this.session$.asObservable();
  }

  isAuthenticated(): boolean {
    return this.session$.value?.isAuthenticated ?? false;
  }

  getCurrentRole(): RoleId | null {
    return this.session$.value?.roleId ?? null;
  }

  private validateSession(): void {
    this.http.get<AuthResponse>(`${this.apiUrl}/validate`)
      .pipe(
        tap((response) => {
          if (isValidRole(response.roleId)) {
            this.session$.next({
              userId: response.userId,
              roleId: response.roleId,
              isAuthenticated: true
            });
          }
        }),
        catchError(() => {
          this.session$.next(null);
          return of(null);
        })
      )
      .subscribe();
  }
}
```

### 4. Role Guard (`apps/shell/src/app/core/guards/auth.guard.ts`)

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@libs/shared/auth';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService = inject(AuthService),
  router = inject(Router)
): Observable<boolean | UrlTree> => {
  if (!authService.isAuthenticated()) {
    return of(router.parseUrl('/login'));
  }

  const userRole = authService.getCurrentRole();
  const requiredRoles: number[] = route.data['roles'] || [];

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole!)) {
    return of(router.parseUrl('/unauthorized'));
  }

  return of(true);
};
```

### 5. Login Component (`apps/shell/src/app/features/login/pages/login/login.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@libs/shared/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        // Navigate based on role
        const roleRouteMap: Record<number, string> = {
          1: '/admin', 2: '/admin', 3: '/member', 4: '/management'
        };
        const route = roleRouteMap[response.roleId];
        this.router.navigate([route]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Invalid email or password'
          : 'An error occurred. Please try again.';
      }
    });
  }
}
```

### 6. Login Template (`apps/shell/src/app/features/login/pages/login/login.component.html`)

```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
  <div class="max-w-md w-full">
    <h2 class="text-3xl font-bold text-center mb-8">Log In</h2>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-900 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          formControlName="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
        />
        <p *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched"
           class="text-red-600 text-sm mt-1">
          Email is required
        </p>
        <p *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched"
           class="text-red-600 text-sm mt-1">
          Please enter a valid email
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-900 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          formControlName="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
        />
        <p *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched"
           class="text-red-600 text-sm mt-1">
          Password is required
        </p>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        [disabled]="isLoading || loginForm.invalid"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {{ isLoading ? 'Logging in...' : 'Log In' }}
      </button>
    </form>
  </div>
</div>
```

### 7. App Routing Module Update (`apps/shell/src/app/app-routing.module.ts`)

```typescript
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: [1, 2] },
    loadChildren: () => import('@shell-remote/admin').then(m => m.AdminModule)
  },
  {
    path: 'member',
    canActivate: [roleGuard],
    data: { roles: [3] },
    loadChildren: () => import('@shell-remote/member').then(m => m.MemberModule)
  },
  {
    path: 'management',
    canActivate: [roleGuard],
    data: { roles: [4] },
    loadChildren: () => import('@shell-remote/management').then(m => m.ManagementModule)
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
```

---

## Development Checklist

- [ ] Create Role enum in `libs/shared/auth/models/role.enum.ts`
- [ ] Create AuthResponse model in `libs/shared/auth/models/auth-response.model.ts`
- [ ] Update AuthService to handle login + role validation
- [ ] Create RoleGuard in `apps/shell/core/guards/auth.guard.ts`
- [ ] Create LoginComponent (TS, HTML, SCSS)
- [ ] Create LoginModule with routing
- [ ] Update shell app-routing.module.ts with login + guarded routes
- [ ] Style login page with Tailwind CSS
- [ ] Test form validation (empty fields, invalid email)
- [ ] Test successful login + redirect to role-specific module
- [ ] Test invalid credentials error handling
- [ ] Test session persistence across page reload
- [ ] Test session timeout + redirect to login
- [ ] Test concurrent login invalidates previous session
- [ ] Test invalid role ID handling

---

## Testing Examples

### Unit Test: AuthService Login

```typescript
it('should login with valid credentials', (done) => {
  const mockResponse: AuthResponse = {
    roleId: 2,
    userId: '123',
    expiresIn: 1800
  };

  service.login('user@example.com', 'password').subscribe((response) => {
    expect(response.roleId).toBe(2);
    expect(service.isAuthenticated()).toBe(true);
    done();
  });

  const req = httpMock.expectOne('/api/auth/login');
  req.flush(mockResponse);
});
```

### E2E Test: Login Flow

```typescript
it('should login and redirect to admin module', () => {
  cy.visit('/login');
  cy.get('input[id="email"]').type('admin@example.com');
  cy.get('input[id="password"]').type('password123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin');
});
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'accessToken' of undefined` | Trying to read httpOnly cookie from JS | Access cookies via backend API only; never via document.cookie |
| `RoleGuard not preventing unauthorized access` | Guard not applied to route | Ensure `canActivate: [roleGuard]` in route config |
| `Session lost on page refresh` | Session not persisted | AuthService should validate session on init; backend should return session status |
| `Invalid role ID error` | Backend returning role not in [1,2,3,4] | Check backend enum; validate role before assigning to user |

---

## Performance Optimization Tips

1. **Lazy Load LoginModule**: Only loaded when user navigates to `/login`
2. **OnPush Change Detection**: Use `ChangeDetectionStrategy.OnPush` in components
3. **Unsubscribe**: Use `takeUntil` or `async` pipe to prevent memory leaks
4. **RxJS Caching**: Use `shareReplay(1)` for session$ to avoid multiple validations

---

## Security Checklist

- [ ] HTTPS enforced in production
- [ ] httpOnly cookies configured on backend
- [ ] SameSite=Strict on all auth cookies
- [ ] No tokens stored in localStorage or sessionStorage
- [ ] Password never logged or sent in non-HTTPS requests
- [ ] Backend validates role on every protected request
- [ ] Invalid role IDs handled gracefully (no 404s)
- [ ] Concurrent login attempts invalidate previous sessions
- [ ] Session timeout enforced server-side

---

## Next Steps

1. **Create specs**: Generate tasks with `/speckit.tasks`
2. **Implement**: Follow task list to build components
3. **Test**: Run unit + e2e tests
4. **Review**: Get PR approved
5. **Deploy**: Merge to main; deploy to production

---

## References

- [Specification](spec.md)
- [Research](research.md)
- [Data Model](data-model.md)
- [Contracts](contracts/)
- [Angular Reactive Forms Docs](https://angular.io/guide/reactive-forms)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Router Guards](https://angular.io/guide/router#preventing-unauthorized-access)
