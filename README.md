# Haut Spare UI

A modern, scalable Angular monorepo featuring independent micro frontend applications with centralized authentication and error handling.

**Live Stack**: Angular 16+ • NX 22+ • TypeScript 5 • Tailwind CSS • Module Federation • RxJS

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Setup

```bash
# Clone repository
git clone <repo-url>
cd haut-spare-ui-all

# Install dependencies
npm install

# Start shell app (http://localhost:4200)
npm start

# In separate terminals, start remotes:
npx nx serve admin      # http://localhost:4201
npx nx serve member     # http://localhost:4202
npx nx serve management # http://localhost:4203
```

Navigate to [http://localhost:4200](http://localhost:4200) in your browser.

## Project Overview

### Apps

| App | Port | Purpose |
|-----|------|---------|
| **shell** | 4200 | Host application with routing, auth, layout |
| **admin** | 4201 | Administrative dashboard (remote) |
| **member** | 4202 | Member profile and preferences (remote) |
| **management** | 4203 | System overview and metrics (remote) |

### Libraries (Planned)

- `@shared/` - Shared utilities and models
- `@ui/` - Shared UI components
- `@auth/` - Authentication utilities

## Features

✨ **Micro Frontend Architecture**
- Independent deployment of each remote
- Runtime module loading via Webpack 5
- Shared dependencies (singleton enforcement)
- Error isolation and recovery

🔐 **Centralized Authentication**
- Shell-managed auth service
- HttpOnly cookies or localStorage tokens
- Automatic token refresh
- Role-based access control

🛡️ **Error Handling**
- Shell-level error boundary
- Automatic error logging to Sentry
- User-friendly error UI with retry
- No cross-app error propagation

📱 **Responsive Design**
- Tailwind CSS for styling
- Mobile-first approach
- SCSS for component-scoped styles

## Usage

### Development

```bash
# Start all apps in watch mode
npm start                    # Shell
npx nx serve admin          # Admin
npx nx serve member         # Member
npx nx serve management     # Management

# Build single app
npx nx build shell --configuration development

# Build all apps
npx nx run-many --target=build --all --configuration development
```

### Testing

```bash
# Unit tests
npx nx test shell
npx nx test admin
npx nx run-many --target=test --all

# E2E tests
npx nx e2e shell-e2e
npx nx run-many --target=e2e --all

# Coverage
npx nx test shell --coverage
```

### Linting

```bash
# Lint single app
npx nx lint shell

# Lint all apps
npx nx run-many --target=lint --all

# Fix lint errors
npx nx lint shell -- --fix
```

### Dependency Graph

Visualize project dependencies:

```bash
npx nx dep-graph
```

Opens interactive dependency graph in browser.

## Project Structure

```
haut-spare-ui-all/
├── apps/
│   ├── shell/              # Host application
│   ├── shell-e2e/          # Shell E2E tests
│   ├── admin/              # Admin remote
│   ├── admin-e2e/          # Admin E2E tests
│   ├── member/             # Member remote
│   ├── member-e2e/         # Member E2E tests
│   ├── management/         # Management remote
│   └── management-e2e/     # Management E2E tests
├── libs/                   # Shared libraries (planned)
├── .github/
│   └── workflows/          # CI/CD pipelines
├── nx.json                 # NX configuration
├── tsconfig.base.json      # TypeScript base config
├── package.json            # Dependencies
├── ARCHITECTURE.md         # Architecture documentation
└── README.md              # This file
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and update as needed:

```bash
# Remote entry URLs (development)
ADMIN_REMOTE_URL=http://localhost:4201/remoteEntry.js
MEMBER_REMOTE_URL=http://localhost:4202/remoteEntry.js
MANAGEMENT_REMOTE_URL=http://localhost:4203/remoteEntry.js

# API
API_BASE_URL=http://localhost:3000/api

# Observability
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=development
```

### TypeScript Paths

Global path aliases (in `tsconfig.base.json`):

```typescript
@app/shell/*      → apps/shell/src/
@admin/*          → apps/admin/src/
@member/*         → apps/member/src/
@management/*     → apps/management/src/
@shared/*         → libs/shared/src/
@ui/*             → libs/ui/src/
@auth/*           → libs/auth/src/
```

## Core Services

### AuthService
Manages authentication across the monorepo:

```typescript
// Inject in any component
constructor(private auth: AuthService) {}

// Use observables
user$ = this.auth.getUser();
isAuthenticated$ = this.auth.isAuthenticated();
hasAdminRole$ = this.auth.hasRole('admin');

// Methods
this.auth.login({ username, password });
this.auth.logout();
this.auth.refreshToken();
```

### ErrorBoundaryService
Catches and handles remote application failures:

```typescript
constructor(private errorBoundary: ErrorBoundaryService) {}

error$ = this.errorBoundary.getError();
hasError$ = this.errorBoundary.hasError();

// Manually capture
this.errorBoundary.captureError(
  error,
  { remoteApp: 'admin', userId: '123' }
);
```

## Deployment

### Local Build

```bash
# Build all apps
npx nx run-many --target=build --all --configuration production

# Output
dist/shell/
dist/admin/
dist/member/
dist/management/
```

### Deployment Strategy

**Shell (Host)**
- Deploy `dist/shell/` to main CDN/app server
- Routes static files and serves `index.html`

**Remotes (Independent)**
- Deploy `dist/admin/` containing `remoteEntry.js` to CDN
- Deploy `dist/member/` independently
- Deploy `dist/management/` independently
- Shell dynamically loads from remote URLs

## Contribution

### Adding a Feature Module

Example: Add Orders module to Admin

```bash
# Generate module
npx nx generate @nx/angular:module \
  --project=admin \
  --name=orders \
  --path=src/app/modules

# Generate page component
npx nx generate @nx/angular:component \
  --project=admin \
  --name=orders-page \
  --path=src/app/modules/orders/pages \
  --style=scss
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/add-orders-module

# Make changes and commit
git add .
git commit -m "feat: add orders module to admin"

# Push and create PR
git push origin feat/add-orders-module
```

## Troubleshooting

### Remote app not loading
**Problem**: Remote shows 404 or fails to load

**Solutions**:
1. Verify remote is running: `http://localhost:4201/remoteEntry.js`
2. Check webpack config `uniqueName` in remote
3. Verify shell webpack config includes remote in remotes section
4. Check browser console for CORS errors
5. Clear browser cache and rebuild

### Authentication not working
**Problem**: Token not being sent in requests

**Solutions**:
1. Verify AuthService is injected in components
2. Check HTTP interceptor is registered in AppModule
3. Verify token exists in browser storage (F12 → Application → Storage)
4. Check Network tab for Authorization header
5. Ensure auth routes are not protected by AuthGuard

### Build errors
**Problem**: TypeScript or webpack build fails

**Solutions**:
1. Clear cache: `rm -rf dist && rm -rf node_modules/.cache`
2. Reinstall dependencies: `npm install`
3. Check TypeScript compilation: `npx tsc --noEmit`
4. Review NX cache: `npx nx reset`

## Performance Tips

- Use lazy loading for feature modules
- Enable production mode for builds: `--configuration production`
- Minimize bundle size with tree-shaking
- Monitor with Sentry for real errors
- Use OnPush change detection in components
- Memoize HTTP requests with shareReplay()

## Resources

- 📖 [Architecture Documentation](ARCHITECTURE.md)
- 🔗 [NX Documentation](https://nx.dev)
- 🔗 [Module Federation Guide](https://webpack.js.org/concepts/module-federation/)
- 🔗 [Angular Documentation](https://angular.io)
- 🔗 [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT

## Support

For issues, feature requests, or contributions, please open an issue or pull request on GitHub.

---

**Happy coding! 🚀**
