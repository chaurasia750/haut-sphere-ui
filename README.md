# Haut Spare UI

A modern, scalable Angular monorepo featuring independent micro frontend applications with centralized authentication and error handling.

**Live Stack**: Angular 16+ • NX 22+ • TypeScript 5 • Tailwind CSS • Module Federation • RxJS

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation

```bash
# Clone repository
git clone <repo-url>
cd haut-spare-ui-all

# Install dependencies
npm install
```

### Running the Application

**Option 1: Run all applications at once (Recommended)**

```bash
# Terminal 1 - Shell (Host)
npx nx serve shell --port 4200

# Terminal 2 - Admin Remote
npx nx serve admin --port 4101

# Terminal 3 - Member Remote
npx nx serve member --port 4102

# Terminal 4 - Management Remote
npx nx serve management --port 4103
```

**Option 2: Run individual applications**

```bash
# Shell (Host Application)
npx nx serve shell --port 4200

# Admin Remote
npx nx serve admin --port 4101

# Member Remote
npx nx serve member --port 4102

# Management Remote
npx nx serve management --port 4103
```

**Access the Application**

Navigate to [http://localhost:4200](http://localhost:4200) in your browser.

The shell application will automatically load and federate the remote modules at runtime.

## Project Structure

```
apps/
├── shell/              # Host application (port 4200)
│   └── src/
│       ├── app/        # Angular modules and components
│       ├── index.html  # Entry point
│       └── main.ts     # Bootstrap
├── admin/              # Admin remote (port 4101)
│   └── src/
│       ├── app/modules/
│       ├── index.html
│       └── main.ts
├── member/             # Member remote (port 4102)
│   └── src/
│       ├── app/modules/
│       ├── index.html
│       └── main.ts
├── management/         # Management remote (port 4103)
│   └── src/
│       ├── app/modules/
│       ├── index.html
│       └── main.ts
└── [app]-e2e/         # End-to-end tests
libs/
├── shared/            # Shared services, utilities, models
├── auth/              # Authentication utilities
├── errors/            # Error handling
├── logging/           # Logging services
└── types/             # Shared type definitions
```

## Project Overview

### Applications

| App | Port | Purpose |
|-----|------|---------|
| **shell** | 4200 | Host application with routing, auth, layout |
| **admin** | 4101 | Administrative dashboard (remote) |
| **member** | 4102 | Member profile and preferences (remote) |
| **management** | 4103 | System overview and metrics (remote) |

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

### Building Applications

```bash
# Build single application
npx nx build shell --configuration=development
npx nx build admin --configuration=development
npx nx build member --configuration=development
npx nx build management --configuration=development

# Build all applications
npx nx run-many --target=build --all --configuration=development

# Production builds
npx nx build shell --configuration=production
npx nx run-many --target=build --all --configuration=production
```

### Development Server

```bash
# Start single app in watch mode
npx nx serve shell --port 4200
npx nx serve admin --port 4101
npx nx serve member --port 4102
npx nx serve management --port 4103

# Start with host configuration
npx nx serve shell --port 4200 --host 0.0.0.0

# View available serve options
npx nx serve shell --help
```

### Testing

```bash
# Unit tests for single app
npx nx test shell
npx nx test admin
npx nx test member
npx nx test management

# Run all unit tests
npx nx run-many --target=test --all

# Run tests with coverage
npx nx test shell --coverage
npx nx run-many --target=test --all --coverage

# E2E tests
npx nx e2e shell-e2e
npx nx e2e admin-e2e
npx nx run-many --target=e2e --all
```

### Linting & Formatting

```bash
# Lint single app
npx nx lint shell
npx nx lint admin

# Lint all apps
npx nx run-many --target=lint --all

# Fix lint errors
npx nx lint shell -- --fix

# Check TypeScript
npx nx run shell:tsc
```

### Dependency Graph

Visualize project dependencies:

```bash
npx nx dep-graph
npx nx dep-graph --focus=shell
```

Opens interactive dependency graph in browser.

## Troubleshooting

### Port Already in Use

If you get "Port already in use" error:

```bash
# Windows: Kill all node processes
taskkill /F /IM node.exe

# Wait for ports to be released
timeout /t 5

# Then restart your servers
npx nx serve shell --port 4200
```

### Module Federation Issues

If remote modules fail to load:

1. **Ensure all servers are running** - Check that all 4 applications are started
2. **Check browser console** - Look for failed module loading errors
3. **Verify module-federation.config.ts** - Ensure remote URLs match your setup
4. **Clear cache**:
   ```bash
   rm -r .nx/cache
   rm -r dist
   npm install
   ```

### Build Failures

If build fails with "Cannot find module":

```bash
# Verify TypeScript paths in tsconfig.base.json
npx nx run-many --target=build --all --verbose

# Clear cache and rebuild
rm -r .nx/cache dist
npm install
npx nx build shell --configuration=development --verbose
```

### TypeScript Compilation Errors

```bash
# Check for TypeScript errors
npx nx run shell:tsc

# Fix all type errors
npx nx lint shell -- --fix
```

## Project Structure

```
haut-spare-ui-all/
├── apps/
│   ├── shell/              # Host application (port 4200)
│   │   ├── src/
│   │   │   ├── app/        # Angular modules and components
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   ├── webpack.config.ts
│   │   ├── module-federation.config.ts
│   │   └── project.json
│   ├── shell-e2e/          # Shell E2E tests (Playwright)
│   ├── admin/              # Admin remote (port 4101)
│   ├── admin-e2e/          # Admin E2E tests
│   ├── member/             # Member remote (port 4102)
│   ├── member-e2e/         # Member E2E tests
│   ├── management/         # Management remote (port 4103)
│   └── management-e2e/     # Management E2E tests
├── libs/
│   ├── shared/             # Shared utilities, models
│   ├── auth/               # Authentication services
│   ├── errors/             # Error handling
│   ├── logging/            # Logging services
│   └── types/              # Shared types and interfaces
├── specs/
│   ├── 001-microfrontend-style/    # Spec documentation
│   └── 002-module-federation-flow/ # Implementation specs
├── .github/
│   └── workflows/          # CI/CD pipelines
├── .nx/                    # NX cache
├── dist/                   # Build output
├── node_modules/           # Dependencies
├── nx.json                 # NX configuration
├── tsconfig.base.json      # TypeScript base config
├── package.json            # Dependencies and scripts
├── ARCHITECTURE.md         # Architecture documentation
└── README.md              # This file
```

## Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Development Server Ports
SHELL_PORT=4200
ADMIN_PORT=4101
MEMBER_PORT=4102
MANAGEMENT_PORT=4103

# Module Federation Remote URLs (for development)
# These should match your development server ports
ADMIN_REMOTE_URL=http://localhost:4101/remoteEntry.js
MEMBER_REMOTE_URL=http://localhost:4102/remoteEntry.js
MANAGEMENT_REMOTE_URL=http://localhost:4103/remoteEntry.js

# API Configuration
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=30000

# Observability
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=development
SENTRY_SAMPLE_RATE=0.1

# Logging
LOG_LEVEL=info
```

### Module Federation Configuration

Each application has a `module-federation.config.ts`:

**Shell (Host)** - `apps/shell/module-federation.config.ts`:
```typescript
{
  name: 'shell',
  filename: 'remoteEntry.js',
  remotes: {
    admin: 'http://localhost:4101/remoteEntry.js',
    member: 'http://localhost:4102/remoteEntry.js',
    management: 'http://localhost:4103/remoteEntry.js'
  },
  shared: {
    '@angular/core': { singleton: true },
    '@angular/common': { singleton: true },
    '@angular/router': { singleton: true },
    'rxjs': { singleton: true }
  }
}
```

**Remote Applications** - `apps/admin/module-federation.config.ts`:
```typescript
{
  name: 'admin',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': 'apps/admin/src/app/admin.module.ts'
  },
  shared: {
    '@angular/core': { singleton: true },
    '@angular/common': { singleton: true },
    '@angular/router': { singleton: true },
    'rxjs': { singleton: true }
  }
}
```

### TypeScript Paths

Global path aliases in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@app/shell/*": ["apps/shell/src/*"],
      "@admin/*": ["apps/admin/src/*"],
      "@member/*": ["apps/member/src/*"],
      "@management/*": ["apps/management/src/*"],
      "@shared/*": ["libs/shared/src/*"],
      "@auth/*": ["libs/auth/src/*"],
      "@errors/*": ["libs/errors/src/*"],
      "@ui/*": ["libs/ui/src/*"]
    }
  }
}
```

## Module Federation Architecture

This project uses **Webpack 5 Module Federation** for micro-frontend architecture:

### How It Works

1. **Shell Application** (Host)
   - Loads at `http://localhost:4200`
   - Manages global routing and authentication
   - Dynamically loads remote modules at runtime
   - Shares core dependencies (Angular, RxJS)

2. **Remote Applications** (Micro Frontends)
   - Admin: `http://localhost:4101`
   - Member: `http://localhost:4102`
   - Management: `http://localhost:4103`
   - Can be deployed independently
   - Share dependencies with shell (singleton pattern)

3. **Shared Dependencies**
   - Core Angular packages are singletons
   - RxJS is shared across applications
   - Custom libraries can also be shared

### Benefits

✅ Independent development of each module  
✅ Parallel deployment capabilities  
✅ Shared dependencies reduce bundle size  
✅ Runtime module composition  
✅ Error isolation between modules  

## Debugging

### Enable Verbose Logging

```bash
# Build with verbose output
npx nx build shell --verbose

# Serve with verbose logging
npx nx serve admin --verbose

# Run tests with verbose output
npx nx test shell --verbose
```

### Chrome DevTools

1. Open `http://localhost:4200` in Chrome
2. Press `F12` to open DevTools
3. Check **Console** tab for errors
4. Check **Network** tab for module loading
5. Check **Sources** tab to debug TypeScript

### Inspect Module Federation

In browser console:

```javascript
// Check if remote is loaded
console.log(window.__webpack_share_scopes__)

// Check module exports
import('admin/Module').then(m => console.log(m))
```

### NX Debug Mode

```bash
# Run with NX debug output
NX_VERBOSE_LOGGING=true npx nx serve shell

# View NX cache
npx nx print-affected --base=main --head=HEAD
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Run tests: `npx nx test --affected`
4. Run linting: `npx nx lint --affected`
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature/your-feature`
7. Open Pull Request

## Performance Optimization

### Bundle Analysis

```bash
# Analyze shell bundle
npx nx build shell --configuration=production --analyze

# Check bundle sizes
npx nx build shell --configuration=production --stats-json
```

### Build Caching

NX automatically caches builds. To clear cache:

```bash
npx nx reset
```

### Dependency Sharing

Optimize shared dependencies in `module-federation.config.ts`:

```typescript
shared: {
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '^16.0.0'
  },
  '@angular/common': { singleton: true },
  'rxjs': { singleton: true, requiredVersion: '^7.0.0' }
}
```

## Deployment

### Production Build

```bash
# Build all applications for production
npx nx run-many --target=build --all --configuration=production

# Output will be in dist/ directory
ls dist/shell dist/admin dist/member dist/management
```

### Docker Support

Each application can be containerized:

```bash
# Build Docker image
docker build -f apps/shell/Dockerfile -t haut-spare-ui-shell .

# Run container
docker run -p 4200:4200 haut-spare-ui-shell
```

## Support & Resources

- **Documentation**: See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture
- **Specifications**: Check [specs/](specs/) directory for design docs
- **NX Documentation**: https://nx.dev
- **Angular Documentation**: https://angular.io
- **Webpack Module Federation**: https://webpack.js.org/concepts/module-federation/

## License

MIT
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
