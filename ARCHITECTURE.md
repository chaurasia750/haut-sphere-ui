# Haut Spare UI - Monorepo Architecture

## Overview

This is an Angular NX monorepo implementing a **Micro Frontend (MFE)** architecture with a shell application and three independent remote applications.

### Architecture Highlights

- **Shell App**: Host application at `/` (port 4200) - handles routing, authentication, and error boundaries
- **Remote Apps**: 
  - Admin (port 4201) - Administrative dashboard and management functions
  - Member (port 4202) - Member profile and preferences
  - Management (port 4203) - System overview and metrics
- **Module Federation**: Runtime-loaded remotes via Webpack 5
- **Shared Authentication**: Centralized auth service in shell
- **Shared State**: On-demand API calls via HTTP
- **Error Handling**: Shell-level error boundary with Sentry integration

## Technology Stack

- **Angular**: 16+
- **NX**: 22.7.0+
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **Module Federation**: Webpack 5
- **HTTP**: RxJS + @angular/common/http
- **Testing**: Vitest + Cypress
- **CI/CD**: GitHub Actions

## Project Structure

```
/
├── apps/
│   ├── shell/           # Host application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/           # Auth, guards, error handling
│   │   │   │   ├── components/     # Error boundary
│   │   │   │   ├── modules/        # Feature modules (dashboard)
│   │   │   │   ├── layout/         # Shell layout
│   │   │   │   ├── app.module.ts
│   │   │   │   ├── app-routing.module.ts
│   │   │   │   └── app.component.ts
│   │   │   └── main.ts
│   │   ├── webpack.config.js       # MFE host config
│   │   └── project.json
│   ├── admin/           # Remote - Admin app
│   ├── member/          # Remote - Member app
│   ├── management/      # Remote - Management app
│   └── *-e2e/           # E2E test suites
├── libs/
│   ├── shared/          # Shared utilities, models
│   ├── ui/              # Shared UI components (future)
│   └── auth/            # Auth utilities (future)
├── nx.json              # NX workspace config
├── tsconfig.base.json   # TypeScript base config + path aliases
├── package.json         # Dependencies and scripts
└── .github/
    └── workflows/       # CI/CD pipelines
```

## Key Features

### 1. Module Federation (MFE)

Each remote app is independently deployable:

```typescript
// Shell routes remotes dynamically
{
  path: 'admin',
  loadChildren: () => import('admin/AdminModule').then(m => m.AppModule)
}
```

Remotes expose their AppModule via webpack config:

```javascript
// admin/webpack.config.js
module.exports = {
  output: { uniqueName: 'admin' },
  // Remotes share core Angular libraries to avoid duplication
  externals: {
    '@angular/core': 'singleton',
    'rxjs': 'singleton'
  }
}
```

### 2. Centralized Authentication

**AuthService** (in shell) manages:
- Token storage (localStorage or HttpOnly cookie)
- User identity
- Token refresh logic
- Role-based access

```typescript
// In any remote
constructor(private authService: AuthService) {}

isAdmin$ = this.authService.hasRole('admin');
user$ = this.authService.getUser();
```

### 3. Error Boundaries

Shell-level error boundary catches remote failures:

```typescript
// Shell wraps layout with error boundary component
<app-error-boundary>
  <app-layout></app-layout>
</app-error-boundary>
```

Failures logged to Sentry with context (userId, remoteApp, etc.)

### 4. Shared State (On-Demand API)

No shared RxJS observables between remotes. Instead:

```typescript
// Remotes call APIs to fetch shell state
this.http.get('/api/shell/state') // theme, locale, preferences
this.http.get('/api/shell/user')  // current user
```

## Getting Started

### Installation

```bash
npm install
```

### Development

**Start Shell**:
```bash
npm start
# Opens http://localhost:4200
```

**Start Remote Apps** (in separate terminals):
```bash
npx nx serve admin      # http://localhost:4201
npx nx serve member     # http://localhost:4202
npx nx serve management # http://localhost:4203
```

### Build

```bash
npm build                           # Build shell
npx nx build admin                  # Build admin
npx nx run-many --target=build --all # Build all apps
```

### Testing

```bash
npx nx test shell                   # Unit tests
npx nx e2e shell-e2e                # E2E tests
npx nx run-many --target=test --all # Test all
```

### Linting

```bash
npx nx lint shell
npx nx run-many --target=lint --all
```

## Routing Flow

### User Story 1: Navigate to Admin

1. User navigates to `/admin`
2. Shell route guard checks authentication
3. Shell lazy-loads admin remote
4. Admin module at `localhost:4201/remoteEntry.js` is fetched
5. Admin AppModule is bootstrapped in shell's router-outlet
6. Admin dashboard displays

### User Story 2: Member Area

1. User navigates to `/member`
2. Member remote loads similarly
3. Member profile module loads under `/member/profile`

## Deployment

### Independent Builds & Deploys

Each app can be deployed independently:

- **Shell**: Deploy to CDN or app server; serves main `index.html`
- **Admin**: Build and deploy `dist/admin/` containing `remoteEntry.js`
- **Member**: Deploy independently
- **Management**: Deploy independently

### Remote URLs

Shell config can point to different environments:

```javascript
// production webpack config
remotes: {
  admin: 'admin@https://cdn.example.com/admin/remoteEntry.js',
  member: 'member@https://cdn.example.com/member/remoteEntry.js',
  management: 'management@https://cdn.example.com/management/remoteEntry.js'
}
```

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `apps/shell/src/app/core/auth/auth.service.ts` | Central auth management |
| `apps/shell/src/app/core/http-interceptor.ts` | Auto-add auth headers, token refresh |
| `apps/shell/src/app/core/error-boundary.service.ts` | Catch remote load failures |
| `apps/shell/src/app/app-routing.module.ts` | Define remote routes + guards |
| `apps/admin/webpack.config.js` | Expose admin module for MFE |
| `apps/member/webpack.config.js` | Expose member module for MFE |
| `.github/workflows/*.yml` | CI/CD pipelines |

## Common Commands

```bash
# Workspace
nx dep-graph                        # Visualize dependencies

# Shell
npx nx serve shell --port=4200
npx nx build shell --configuration production

# Admin
npx nx serve admin --port=4201
npx nx build admin --configuration production

# All
npx nx run-many --target=build --all
npx nx run-many --target=test --all
npx nx run-many --target=lint --all
```

## Environment Variables

See `.env.example` for required variables:

```bash
# Remote entry URLs (development)
ADMIN_REMOTE_URL=http://localhost:4201/remoteEntry.js
MEMBER_REMOTE_URL=http://localhost:4202/remoteEntry.js
MANAGEMENT_REMOTE_URL=http://localhost:4203/remoteEntry.js

# API
API_BASE_URL=http://localhost:3000/api

# Observability
SENTRY_DSN=https://...@sentry.io/...
```

## Troubleshooting

### Remote not loading
- Check port is running: `lsof -i :4201`
- Verify `remoteEntry.js` exists: `http://localhost:4201/remoteEntry.js`
- Check browser console for CORS errors
- Verify webpack config `uniqueName` matches shell remotes config

### Auth token not sent
- Check HTTP interceptor is registered
- Verify token exists in localStorage
- Check NetworkTab for Authorization header

### Remote error displays
- Check shell error boundary component is wrapping layout
- Verify error-boundary.service is provided
- Check Sentry DSN is configured

## Future Enhancements

- [ ] Shared UI library (`@ui/*`)
- [ ] Shared utilities library (`@shared/*`)
- [ ] State management (NgRx/Akita)
- [ ] API client library
- [ ] Performance monitoring
- [ ] Component library with Storybook
- [ ] Documentation site
- [ ] Monorepo plugin for generator templates

## References

- [NX Documentation](https://nx.dev)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Angular Routing](https://angular.io/guide/router)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
