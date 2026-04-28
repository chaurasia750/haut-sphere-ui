# Remote Application Contract

**Version**: 1.0 | **Date**: April 29, 2026 | **Status**: Locked

---

## Overview

This document defines the contract that each remote application (Admin, Member, Management) must fulfill to be loaded and managed by Shell.

---

## Module Exports (Module Federation)

Each remote MUST expose a single entry module via Module Federation.

### Exposed Module Structure

```typescript
// admin/src/app/app.module.ts (or equivalent)
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    // ... feature imports
  ],
  providers: [
    // Remote-specific services
  ]
})
export class AppModule {}
```

### Module Federation Configuration

```typescript
// admin/module-federation.config.ts
export const config = {
  name: 'admin',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': './src/app/app.module.ts',  // Single entry point
  },
  shared: {
    '@angular/core': { singleton: true },
    '@angular/common': { singleton: true },
    'rxjs': { singleton: true },
    // ... other shared libs
  }
};
```

### Shell Will Import Like This

```typescript
// Shell loads remote dynamically
const AdminModule = await import('admin/Module');
const componentFactory = this.componentFactoryResolver
  .resolveComponentFactory(AdminModule.AppComponent);
```

---

## Routing Requirements

Each remote MUST implement its own routing independently.

### Entry Point Structure

```typescript
// admin/src/app/app.module.ts
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', // Remote mounted at /admin, so '' is the root
        component: AdminLayoutComponent,
        children: [
          // All remote routes here
          { path: 'users', component: UsersComponent },
          { path: 'settings', component: SettingsComponent },
          { path: '', redirectTo: 'users' }
        ]
      }
    ])
  ]
})
export class AppModule {}
```

### Route Examples

Shell mounts Admin at `/admin`:
- `/admin` → Admin layout
- `/admin/users` → Users list (handled by Admin router)
- `/admin/users/123` → User detail (handled by Admin router)

Remote router is completely independent; Shell only knows about `/admin` prefix.

---

## Standalone Component Alternative

If using Angular standalone components (recommended):

```typescript
// admin/src/app/app.component.ts
@Component({
  selector: 'app-admin-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet, CommonModule]
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.config = [
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'users' }
    ];
  }
}

// Module Federation exposes the component directly
export default AppComponent;
```

---

## Authentication Requirements

Each remote MUST respect Shell's authentication state.

### Required Auth Implementation

```typescript
import { AuthService, AuthGuard, RoleGuard } from '@libs/shared/auth';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['admin'] // Remote-specific role check
        }
      }
    ])
  ]
})
export class AppModule {}
```

### Auth Flow

1. User unauthenticated → Shell redirects to login (Shell's responsibility)
2. User authenticated but unauthorized → Remote's RoleGuard rejects → Shell shows unauthorized
3. User authenticated and authorized → Remote component loads
4. Token expires → HTTP interceptor catches 401 → Shell triggers logout
5. Remote receives logout event → Cleans up

---

## Service Architecture

### Remote-Owned Services

Each remote owns and implements its domain services:

```typescript
// admin/src/app/services/user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/admin/users');
  }
}
```

### Shared Service Usage

Remotes use shared services from Shell:

```typescript
import { AuthService, ErrorHandlerService, LoggingService } 
  from '@libs/shared/...';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private logger: LoggingService
  ) {}
  
  getUsers() {
    this.logger.info('Loading users');
    return this.http.get<User[]>('/api/admin/users').pipe(
      catchError(error => {
        this.errorHandler.handle({
          type: 'runtime',
          remoteKey: 'admin',
          originalError: error,
          recoverable: true
        });
        return throwError(() => error);
      })
    );
  }
}
```

### NO Direct Inter-Remote Service Calls

❌ **NOT ALLOWED**:
```typescript
// admin/src/services/something.service.ts
// DON'T IMPORT FROM OTHER REMOTES
import { MemberService } from 'member/Module'; // ❌ NOT ALLOWED
```

✅ **CORRECT**:
```typescript
// If admin needs member data, use API
// admin/src/services/something.service.ts
constructor(private http: HttpClient) {}

getMemberData() {
  return this.http.get('/api/members/data'); // ✅ Go through API
}
```

---

## Dependency Management

### Allowed Dependencies

Each remote can depend on:
- ✅ `@angular/core`, `@angular/common`, etc. (shared)
- ✅ `rxjs` (shared)
- ✅ `libs/shared/*` (shared infrastructure)
- ✅ Its own internal libraries
- ✅ External npm packages (if not in shared)

### NOT Allowed

- ❌ Direct imports from other remotes
- ❌ Importing other remotes' non-shared libraries
- ❌ Duplicate versions of shared packages

### Module Federation Shared Config

```typescript
// admin/module-federation.config.ts
export const config = {
  // ... other config
  shared: {
    '@angular/core': { 
      singleton: true, 
      strictVersion: true 
    },
    '@angular/common': { singleton: true },
    'rxjs': { singleton: true },
    
    // Import shared libraries
    '@libs/shared/auth': { singleton: true },
    '@libs/shared/errors': { singleton: true },
    '@libs/shared/types': { singleton: true },
    '@libs/shared/logging': { singleton: true }
  }
};
```

---

## State Management

### No Global State

Each remote manages its own state independently:

```typescript
// admin/src/app/store/user.store.ts (or state management of choice)
// Uses signals, ngxs, akita, or simple BehaviorSubject
// This state is NOT shared with other remotes
```

### No Cross-Remote State

❌ **NOT ALLOWED**: Storing global state that other remotes access

✅ **CORRECT**: Each remote has isolated state

```typescript
// admin/src/app/store/
//   ├── users.store.ts        // Admin's user state
//   ├── settings.store.ts      // Admin's settings state
//   └── ...

// member/src/app/store/
//   ├── profile.store.ts       // Member's profile state
//   ├── preferences.store.ts   // Member's preferences state
//   └── ...
```

### Sharing Data via API

If multiple remotes need same data:

```typescript
// API provides single source of truth
// All remotes call the same endpoint
GET /api/users/current  // Admin calls this
GET /api/users/current  // Member calls this
GET /api/users/current  // Management calls this
```

---

## Cleanup on Unload

Remote MUST implement proper cleanup in `ngOnDestroy`:

```typescript
@Component({...})
export class AdminComponent implements OnDestroy {
  private subscriptions = new Subscription();
  
  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.subscriptions.add(
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      })
    );
  }
  
  ngOnDestroy() {
    // CRITICAL: Unsubscribe all subscriptions
    this.subscriptions.unsubscribe();
    
    // CRITICAL: Clear timers
    // clearTimeout(), clearInterval()
    
    // CRITICAL: Detach from change detection if needed
    this.changeDetectorRef.detach();
    
    // CRITICAL: Clear any global listeners
    // removeEventListener(), etc.
  }
}
```

### Use OnDestroy in All Containers

```typescript
@Component({...})
export class RemoteRootComponent implements OnDestroy {
  subscriptions = new Subscription();
  
  ngOnInit() {
    // Subscribe to things
    this.subscriptions.add(...);
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    // Any other cleanup
  }
}
```

---

## Error Handling

Remote MUST NOT let unhandled errors crash the Shell.

### Caught vs Uncaught Errors

✅ **Caught (correct)**:
```typescript
this.service.getData().subscribe(
  data => this.data = data,
  error => this.errorHandler.handle(error) // ✅ Caught
);
```

❌ **Uncaught (crashes remote, but Shell survives)**:
```typescript
throw new Error('Something broke'); // ❌ Will be caught by Shell's error boundary
```

### HTTP Error Handling

```typescript
getUsers() {
  return this.http.get('/api/users').pipe(
    catchError(error => {
      this.errorHandler.handle({
        type: 'runtime',
        remoteKey: 'admin',
        originalError: error,
        recoverable: error.status !== 403, // 403 forbidden = not recoverable
      });
      return of([]); // Return default value or rethrow
    })
  );
}
```

---

## Performance Requirements

- **Bundle size**: ≤1 MB (gzipped)
- **Initialization**: Complete within 1 second after entry loaded
- **No blocking operations**: Don't block main thread during init
- **Memory**: Properly cleaned up on unload (no memory leaks)
- **Change detection**: Don't trigger unnecessary Shell re-renders

---

## Testing Requirements

Each remote SHOULD include:

- ✅ Unit tests for services (Jest)
- ✅ Component tests for critical components
- ✅ E2E tests for critical user flows (Playwright)
- ✅ Standalone functionality tests (can run without Shell)

### Testing Standalone

Remote must be testable independently:

```bash
# Dev server - can run admin standalone
nx serve admin

# Should load at http://localhost:4101 without Shell
# All admin features should work

# Tests - run without Shell
nx test admin
```

---

## Documentation Requirements

Each remote MUST include:

- ✅ `README.md` describing the remote's purpose
- ✅ Architecture diagram (if complex)
- ✅ Setup/build instructions
- ✅ Known issues and workarounds
- ✅ Contact person for support

---

## Versioning Contract

Remote version numbers should follow semantic versioning:

```
admin@1.2.3
  │ │ └─ Patch (bug fixes, backward compatible)
  │ └─── Minor (new features, backward compatible)
  └───── Major (breaking changes)
```

### Compatibility Requirements

- Remote MUST work with Shell's shared library version
- Remote MUST declare peer dependency on shared libs version
- Breaking changes require major version bump
- Deprecations require minor version bump

---

## Breaking Changes

If remote makes breaking change:

1. Bump major version
2. Notify Shell team (and other remotes if they depend on remote data)
3. Update documentation
4. Provide migration guide if needed

---

## Support & Help

- **Questions about Shell contract**: Check [shell-contract.md](shell-contract.md)
- **Questions about data model**: Check [../data-model.md](../data-model.md)
- **Questions about setup**: Check [../quickstart.md](../quickstart.md)
- **Issues/Bugs**: Open GitHub issue with remote name + description

---

## Document References

- **Specification**: [../spec.md](../spec.md)
- **Data Model**: [../data-model.md](../data-model.md)
- **Shell Contract**: [shell-contract.md](shell-contract.md)
- **Quickstart**: [../quickstart.md](../quickstart.md)

