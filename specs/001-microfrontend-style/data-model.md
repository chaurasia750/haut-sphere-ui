# Data Model: Microfrontend Style (NX + Angular Enterprise)

**Phase 1 Output** | **Date**: 2026-04-29 | **Related Plan**: [plan.md](plan.md)

## Core Entities

### 1. Application (Shell / Admin / Member / Management)

**Definition**: Independent deployable Angular application within the monorepo.

**Properties**:
- `name`: string (shell, admin, member, management)
- `baseRoute`: string (/, /admin, /member, /management) - path at which remotes are mounted in shell
- `isRemote`: boolean (shell = false; admin, member, management = true)
- `remoteEntry`: string (remote only) - URL to `remoteEntry.js` for module federation
- `appModule`: string - class name of root NgModule (e.g., `AppModule`)
- `version`: string (semantic; set per-app release cycle)

**Relationships**:
- Shell hosts remotes (shell contains route configuration for remotes)
- Remotes are isolated; no direct app-to-app imports

**Constraints**:
- No remote may import another remote's code at build time
- All cross-app communication via routing (shell) or backend APIs
- Remotes must run independently (`nx serve [remote-name]`)

---

### 2. Feature Module

**Definition**: Self-contained Angular NgModule within a remote app, encapsulating one business domain.

**Properties**:
- `name`: string (kebab-case; e.g., `user-management`, `dashboard`, `reports`)
- `path`: string (location in apps/[remote]/src/app/modules/[name]/)
- `rootComponent`: string - entry component when module loaded
- `routes`: Route[] - feature-level routing
- `components`: Component[] - list of declared components
- `services`: Service[] - feature-scoped business logic services
- `models`: Interface/Type[] - domain models and DTOs

**Folder Structure**:
```
apps/[remote]/src/app/modules/[name]/
├── components/
│   ├── [component-name]/
│   │   ├── [component-name].component.ts
│   │   ├── [component-name].component.html
│   │   ├── [component-name].component.scss
│   │   └── [component-name].component.spec.ts
│   └── ...
├── pages/
│   ├── [page-name]/
│   │   ├── [page-name].page.ts
│   │   ├── [page-name].page.html
│   │   ├── [page-name].page.scss
│   │   └── [page-name].page.spec.ts
│   └── ...
├── services/
│   ├── [service-name].service.ts
│   ├── [service-name].service.spec.ts
│   └── ...
├── models/
│   ├── [entity].model.ts
│   └── ...
├── guards/
│   ├── [guard-name].guard.ts
│   └── ...
├── [name].module.ts
├── [name]-routing.module.ts
└── README.md
```

**Relationships**:
- One feature module per business domain
- Modules within the same app can reference each other via `SharedModule` (app-scoped) or import directly
- No cross-app module imports

**Constraints**:
- One NgModule per domain (no "god modules")
- Services defined within module; no export to other apps
- Components and services are lazy-loadable via `loadChildren()`

---

### 3. Authentication State (Shell)

**Definition**: Centralized user identity and credentials managed by shell.

**Properties**:
- `userId`: string
- `username`: string
- `email`: string
- `roles`: string[] (e.g., ['admin', 'member'])
- `accessToken`: string (bearer token for API calls)
- `refreshToken`: string (stored in HttpOnly cookie; not exposed to app)
- `expiresAt`: number (Unix timestamp)
- `lastRefreshedAt`: number (Unix timestamp)

**Accessibility**:
- Shell: owns state; updates in `AuthService`
- Remotes: access via injected `AuthService` (observable API) or HTTP API (`GET /api/auth/user`)

**State Transitions**:
- Initial: unauthenticated (no token)
- → Login: exchange credentials for tokens
- → Authenticated: token in scope; user data available
- → Token Expired: trigger refresh via interceptor
- → Logout: clear tokens; redirect to login

**Storage**:
- `accessToken`: HttpOnly secure cookie (preferred) or localStorage (fallback)
- `refreshToken`: HttpOnly secure cookie (never exposed to JS)
- `user`: in-memory (AuthService); restored on page reload from cookies/API

---

### 4. Shared State (On-Demand API)

**Definition**: Non-business state (theme, locale, UI preferences) accessible to remotes via shell HTTP API.

**Properties** (example):
- `theme`: 'light' | 'dark'
- `locale`: 'en' | 'es' | 'fr' (etc.)
- `sidebarCollapsed`: boolean
- `userPreferences`: object (customizable UI layout, etc.)

**Access Pattern**:
- Remotes call HTTP endpoint: `GET /api/shell/state`
- Response: JSON object with current theme, locale, preferences
- No subscription or shared Observable; each remote fetches independently when needed
- Shell can trigger state updates via event (e.g., user changes theme in header); remotes detect via polling or WebSocket (future enhancement)

**Constraints**:
- No business logic state here (e.g., user data belongs in auth service)
- Stateless from remote perspective (no shared RxJS Subject)

---

### 5. Remote Entry Module (Module Federation)

**Definition**: Angular module exposed by each remote for shell to load.

**Properties**:
- `name`: string (matches app name in NX config; e.g., 'admin')
- `exposes`: object mapping public paths to module files
  - Example: `{ './Module': 'apps/admin/src/app/app.module' }`
- `shared`: object declaring shared dependencies (Angular, RxJS, Tailwind)
- `singleton`: boolean (true for shared libs; ensures single instance across remotes)

**Example (webpack.config.js)**:
```javascript
module.exports = {
  output: { uniqueName: 'admin' },
  plugins: [
    new ModuleFederationPlugin({
      name: 'admin',
      filename: 'remoteEntry.js',
      exposes: { './AdminModule': 'apps/admin/src/app/app.module' },
      shared: {
        '@angular/core': { singleton: true },
        '@angular/common': { singleton: true },
        'rxjs': { singleton: true },
      },
    }),
  ],
};
```

---

### 6. Error Boundary (Shell Core)

**Definition**: Shell component/service that catches and handles remote load failures.

**Properties**:
- `remoteApp`: string (name of failed remote)
- `error`: Error object (original thrown error)
- `errorCode`: number (HTTP status if applicable)
- `timestamp`: number (Unix timestamp)
- `userId`: string (for context in logs)
- `userAction`: string (what user was attempting; e.g., "navigate to /admin")

**Behavior**:
- Shell detects remote load failure (module federation timeout, 404, syntax error)
- Error logged to Sentry with full context
- User shown error banner/modal with:
  - Message: "Unable to load [remote] app. Try refreshing the page."
  - Retry button (reloads remote)
  - Alternate navigation option (link to other app)
- Shell continues to function; other remotes unaffected

**Constraints**:
- Error must not propagate to crash shell app
- All errors logged with userId, remote name, route, timestamp for debugging

---

## Data Relationships

```
Shell (Host)
├── Global Layout (header, sidebar)
├── Authentication State (user, tokens)
├── Shared State API (theme, locale)
├── Error Boundary Service
├── Routes
│   ├── /admin → Admin Remote (lazy-loaded)
│   │   ├── Feature Module 1 (users/)
│   │   ├── Feature Module 2 (dashboard/)
│   │   └── Core (interceptors, services)
│   ├── /member → Member Remote (lazy-loaded)
│   │   └── [similar structure]
│   └── /management → Management Remote (lazy-loaded)
│       └── [similar structure]
└── libs/ (optional, promoted after ≥2 remotes + ≥3 releases)
    ├── ui/ (reusable components)
    ├── shared/ (models, types, helpers)
    └── auth/ (if extracted)

Remotes (admin, member, management)
├── Feature Modules (1 per domain)
│   ├── Components
│   ├── Pages
│   ├── Services (scoped to feature)
│   ├── Models
│   └── Guards
├── Core (app-level)
│   ├── HTTP Interceptors (add auth header, handle errors)
│   └── Services (error handler, analytics shim, etc.)
└── Shared (app-level)
    └── Reusable UI primitives (buttons, dialogs, etc.)
```

---

## Validation Rules

### Per-App

1. No remote imports another remote's modules or services
2. No cross-remote RxJS observables or shared state
3. All HTTP calls include auth token (via shell interceptor)
4. Error boundaries prevent remote crashes from affecting shell

### Per-Feature Module

1. One NgModule per business domain
2. All feature services scoped to module (no global export)
3. Routes defined in feature-routing.module
4. Components use separate `.ts`, `.html`, `.scss` files
5. No inline styles or templates

### Styling

1. Only Tailwind utilities + per-component SCSS
2. No global CSS overrides (except established patterns in shell layout)
3. Component SCSS file lives alongside component files

---

(End of data model)
