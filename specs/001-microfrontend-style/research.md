# Research: Microfrontend Style (NX + Angular Enterprise)

**Phase 0 Output** | **Date**: 2026-04-29 | **Related Plan**: [plan.md](plan.md)

## Overview

This document resolves 5 technical unknowns identified during planning. Each research topic provides a decision, rationale, and alternatives considered.

---

## 1. Module Federation Setup

**Unknown**: NX supports module federation; need to determine version and configuration pattern.

### Decision

Use **@nx/angular module federation plugin** (NX v15+) with **Webpack 5 Module Federation** (native support). Each remote app exposes an Angular module via `remoteEntry.js`; shell routes dynamically load remotes using `loadRemoteModule()`.

### Rationale

- **Native NX support**: `@nx/angular` includes schematics and builders for module federation out-of-the-box.
- **Webpack 5 stability**: Module Federation is stable and widely adopted in Angular enterprise; proven pattern.
- **Independent versioning**: Each remote can be deployed independently with its own version of shared libraries (within bounds).
- **Zero-config defaults**: NX generates boilerplate; minimal manual Webpack configuration needed.

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|------------------|
| **Single Build (Monolithic)** | Violates requirement for independent deployment; tightly couples apps |
| **Lazy Loading Only (No MFE)** | Remotes still coupled at build time; cannot deploy independently |
| **Custom SystemJS/UMD** | More manual work; less official NX support; outdated pattern |
| **Nx buildable libraries as remotes** | Reduces build isolation; doesn't solve independent deployment problem |

### Implementation Notes

- Use `@nx/angular` schematics: `nx generate @nx/angular:app [name] --mfe --mfeType=remote`
- Shell app configured as `--mfeType=host`
- Each remote exposes a "bootstrap" module via `remoteEntry.ts`
- Shared dependencies (Angular, RxJS, Tailwind) versioned in `package.json`

---

## 2. Error Boundary & Observability

**Unknown**: Shell error handling + observability (Sentry/Datadog integration specifics).

### Decision

Implement **error boundary service** in shell core with **Sentry integration** for centralized logging. Remote failures caught in shell; errors logged with context (app name, route, user ID); user shown recovery UI (retry button or alternate route).

### Rationale

- **Sentry widely supported**: Deeply integrated with Angular; simple setup via `@sentry/angular` and `@sentry/tracing`.
- **Error boundaries proven**: React error boundaries + Angular patterns show this isolates failures effectively.
- **Context-rich logging**: Sentry captures breadcrumbs, user sessions, and performance data—essential for debugging production MFE issues.
- **Cost-effective**: Sentry's free tier supports enterprise use; pay-as-you-grow.

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|------------------|
| **Datadog** | More expensive; similar capabilities to Sentry for MFE use case |
| **ELK Stack (self-hosted)** | Operational overhead; requires DevOps infra investment; Sentry faster to deploy |
| **Console logging + monitoring** | No centralized view; hard to correlate errors across remotes; poor UX |
| **No observability** | Violates spec requirement for error logging; production support impossible |

### Implementation Notes

- `shell/src/app/core/error-boundary.service.ts`: Wraps remote loads; catches and logs errors
- `shell/src/app/core/sentry-init.ts`: Initialize Sentry on app start
- Remote load failures trigger `ErrorBoundaryComponent` (displays user-friendly message + retry)
- All errors include: timestamp, remote app name, user ID, route, error stack

---

## 3. Auth Service Architecture

**Unknown**: Shell-provided auth service pattern; token storage strategy.

### Decision

Use **HttpOnly secure cookies** (preferred) or **localStorage** (fallback) for token storage. Shell provides **AuthService** (injectable, core-scoped) with:
- `getToken(): Observable<string>`
- `getUser(): Observable<User>`
- `login(credentials): Observable<User>`
- `logout()`
- `refreshToken(): Observable<string>`

Remotes inject and consume `AuthService` or fetch state via HTTP API (`GET /api/auth/user`).

### Rationale

- **HttpOnly cookies best practice**: Protects against XSS token theft; browser handles refresh automatically.
- **Observable-based API**: Aligns with Angular reactive patterns; remotes can subscribe or use `.toPromise()`.
- **Dual fallback**: If cookies not available (e.g., testing), localStorage provides backup.
- **Refresh token flow**: Centralized in shell; reduces per-remote auth logic.

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|------------------|
| **localStorage only** | Simpler but vulnerable to XSS; violates OWASP best practices |
| **SessionStorage** | Lost on browser restart; poor UX for long-lived sessions |
| **Each remote handles auth** | Violates spec requirement for shell-managed auth; causes state drift |
| **JWT decoded in browser** | Same security risk as localStorage; complexity with expiry in UI |

### Implementation Notes

- Shell stores token in HttpOnly cookie (set by backend on login response)
- Remotes call `AuthService.getUser()` on init to populate user state
- HTTP Interceptor (shell core) automatically adds `Authorization: Bearer` header to API calls
- Token expiry triggers `refreshToken()` automatically via interceptor
- Remotes can skip token management; just consume `AuthService`

---

## 4. Build & Deployment Strategy

**Unknown**: Independent CI/CD for remotes; versioning and orchestration.

### Decision

**Git-based versioning** per app with **GitHub Actions** (or equivalent CI). Each remote has:
- Separate workflow file (`.github/workflows/build-admin.yml`, etc.)
- Triggered on push to `main` or manual trigger
- Builds and deploys to artifact storage (npm registry, GitHub Releases, or cloud artifact store)
- Shell separately deploys and loads remotes by version tag in `remoteEntry.json`

### Rationale

- **Independent trigger**: Each app deploys on its own schedule; no monolithic release cycles.
- **Version tracking**: Git tags (e.g., `admin@1.2.3`) provide clear history and rollback capability.
- **Atomic deployments**: Build once, test once, deploy to production—no rebuild in staging.
- **Cloud-native patterns**: Aligns with modern DevOps/SRE practices (Kubernetes, Vercel, AWS Amplify).

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|------------------|
| **Single CI pipeline for all apps** | Defeats independent deployment goal; forces coordinated releases |
| **Manual deployment** | Error-prone; no audit trail; scales poorly with team size |
| **Continuous deployment without versioning** | No rollback capability; hard to correlate issues to versions |
| **Feature branches auto-deploy to staging** | Works but requires versioning strategy; recommended as Phase 2 enhancement |

### Implementation Notes

- Each app's workflow: build → test (unit + e2e) → tag version → push to registry → deploy to CDN/server
- Shell's `remoteEntry.json` updated to reference latest (or pinned) remote versions
- Consider: Monorepo versioning (all remotes same version) vs. independent versioning (each app own version)
  - **Recommended for Phase 1**: Independent versioning (more flexibility; remotes can iterate independently)
  - **Phase 2**: Evaluate monorepo versioning if coordination needed

---

## 5. Tailwind Configuration & Sharing

**Unknown**: Workspace-level config sharing across shell + remotes; Tailwind purging strategy.

### Decision

**Single `tailwind.config.js`** at workspace root; all apps (shell + remotes) reference it. Use **file-based purging** (Tailwind v3 default) with glob patterns for `src` and `libs` directories. No custom purge per app.

### Rationale

- **Consistency**: Single source of truth for design tokens, theme, utilities.
- **File-based purging (Tailwind v3)**: More reliable than JIT; no runtime overhead.
- **Workspace glob patterns**: Tailwind automatically scans `/apps/*/src/**/*.{ts,html}` and `/libs/**/*.ts`; includes shell + all remotes.
- **Team alignment**: Enforces consistent utility usage; prevents style drift.

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|------------------|
| **Per-app tailwind.config.js** | Creates inconsistency; harder to maintain design tokens; duplicated config |
| **CSS-in-JS (Emotion/Styled Components)** | Contradicts spec requirement for Tailwind; adds runtime dependencies |
| **Per-remote SCSS-only** | Loses Tailwind utility benefits; harder to maintain responsive design |
| **JIT mode (Tailwind v2)** | v3 file-based is more performant and stable; avoid legacy patterns |

### Implementation Notes

- `tailwind.config.js` at repo root:
  ```javascript
  module.exports = {
    content: [
      'apps/*/src/**/*.{ts,html}',
      'libs/*/src/**/*.{ts,html}',
    ],
    theme: { /* design tokens */ },
    plugins: [],
  };
  ```
- Each app's `tsconfig.json` references workspace `tailwind.config.js` (or inherits via `tsconfig.base.json`)
- Component-level SCSS for custom styles (not covered by Tailwind) stored in component directories
- Example: `apps/admin/src/app/modules/users/components/user-card/user-card.component.scss`

---

## Decisions Summary

| # | Topic | Decision | Confidence |
|---|-------|----------|-----------|
| 1 | Module Federation | @nx/angular + Webpack 5 MFE | 95% |
| 2 | Error Boundary & Observability | Shell error boundary + Sentry | 90% |
| 3 | Auth Service | Shell-provided Observable API + HttpOnly cookies | 95% |
| 4 | Build & Deployment | Independent CI/CD workflows; independent versioning | 85% |
| 5 | Tailwind Config | Single workspace config; file-based purging | 95% |

---

## Next Steps

- **Phase 1**: Generate `data-model.md` with entity definitions
- **Phase 1**: Create `contracts/` with API contracts (if any) and module federation exports
- **Phase 1**: Create `quickstart.md` with developer setup and run instructions
- **Phase 1**: Update `.github/copilot-instructions.md` with plan reference

(End of research)
