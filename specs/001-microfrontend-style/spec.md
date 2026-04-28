# Feature Specification: Microfrontend Style (NX + Angular Enterprise)

**Short name**: microfrontend-style
**Created**: 2026-04-29
**Status**: Draft
**Input**: SPEC (MICRO FRONTEND STYLE – NX + ANGULAR ENTERPRISE)

## Overview

Purpose: Establish a workspace and architectural conventions to support independent, deployable Angular micro frontends (MFE) using NX. Each app is an independent micro frontend; the `shell` is the host/container and `admin`, `member`, `management` are remote apps. The goal is strict separation of concerns, independent deployability, and scalable team ownership.

## Root Structure

- apps/
  - shell/ (host)
  - admin/ (remote)
  - member/ (remote)
  - management/ (remote)
- libs/ (optional, minimal use)

## Shell (Host Application)

Purpose: container and orchestrator.

Structure (inside `shell/src/app`):
- layout/
- core/
- routes/
- app.module
- app-routing.module

Responsibilities:
- Global layout (header, sidebar)
- Routing entry point
- Loading remote apps
- **Authentication flow and state management**: Shell owns all authentication logic and user identity state. Remotes receive tokens and user identity via shell-provided auth service or URL parameters.
- Provide centralized auth service to remotes

Rule: shell must not contain business logic belonging to remotes.

## Remote Apps (admin / member / management)

Each remote app is fully independent:

Structure (each app):
- src/app/
  - modules/
  - core/
  - shared/
  - app.module
  - app-routing.module

Rules: no direct imports from other remotes; no shared runtime coupling.

## Module Structure (per remote app)

- modules/
  - feature-name/
    - components/
    - pages/
    - services/
    - models/
    - guards/
    - feature-name.module
    - feature-name-routing.module

Rules:
- One feature = one module
- Modules are self-contained and import only local app-level libs
- No cross-module dependencies inside same app (except clearly defined shared submodules)

## Core (per app)

Contains:
- HTTP interceptors
- App-level scoped services (auth adapter, error handler, analytics shim)

Rules:
- Scoped per app; do not export app core across apps

## Shared (per app)

Small reusable UI primitives and helpers used only inside the app.

Rules:
- Only inside that app; avoid creating global shared coupling

---

## Workspace-Level libs/ Package Promotion

Criteria for extracting code to workspace-level `libs/` shared across remotes:
- Used by ≥2 remotes
- Stable across ≥3 releases
- Approved via architecture review
- Clearly versioned and documented

---

## Observability & Error Handling

**Remote Load Failures**:
- Shell detects load failure and displays error banner or modal to user
- Error is logged to centralized observability platform (e.g., Sentry, Datadog)
- Shell continues to function; other remotes are not affected
- User can retry or navigate to alternate section

**Runtime Crashes in Remotes**:
- Remote crash does not crash shell or adjacent remotes (strict error boundary)
- Error is logged with stack trace and context
- User sees informative error page or recovery option

## Micro Frontend Rules

- Apps must run independently locally and in CI
- Apps must be deployable independently
- No remote → remote imports

Communication between apps:
- By routing managed by shell
- By backend APIs only (no direct module-level sharing)
- **Shared state access**: Remotes request non-business state (e.g., theme, locale, sidebar data) on-demand from shell API endpoints; no runtime subscriptions or shared service observables between apps

## Routing Flow

- The `shell` controls main routes and loads remotes dynamically.

Example mapping:
- `/admin` → admin app
- `/member` → member app
- `/management` → management app

Rules:
- Shell loads remotes (module federation or other host/remote mechanism)
- Remotes handle internal, deep routes beneath their base path

## File Structure Rule

Each component/page must have separate files:
- `.ts`
- `.html`
- `.scss`

Rules:
- No inline templates
- No inline styles

## Styling

- Tailwind configured at workspace level
- SCSS used per component for local styles

Rules:
- Consistent UI tokens and utility classes
- Avoid global style conflicts by scoping component styles

## Dependency Rule

- shell → loads remotes (host responsibilities)
- remotes → completely isolated
- No direct remote-to-remote dependency

## Scalability

- New domain = new app
- Minimal or no modification to existing apps when adding apps
- Independent team ownership per app

## Final Goal

- Independent deployable apps
- Clean separation of concerns
- Scalable enterprise architecture
- Strict SRP inside each module

## User Scenarios & Testing

### User Story 1 - Navigate to Admin (P1)
As an authenticated admin user, I navigate to `/admin` and the admin app loads inside the shell, showing the admin dashboard.

**Independent Test**: Run shell locally, visit `/admin`, remote loads and renders dashboard.

Acceptance:
1. Given an authenticated user, when they visit `/admin`, then the admin remote is loaded and its root page is shown.

### User Story 2 - Member Area (P1)
As a member, visiting `/member` loads member app with member-specific routes.

**Independent Test**: Visit `/member/profile` and confirm member app handles internal routing.

### Edge Cases
- Remote fails to load: shell shows a retry/error placeholder and logs failure to centralized observability platform; shell and other remotes continue to function.
- Remotes serve incompatible runtime: shell must isolate errors and avoid crashing; error is logged and displayed to user with recovery option.

## Functional Requirements

- **FR-001**: Workspace MUST provide `shell` app that dynamically loads remotes by route.
- **FR-002**: Each remote app (admin, member, management) MUST be runnable independently (ng serve or equivalent).
- **FR-003**: No remote app may import code from another remote app.
- **FR-004**: Shared UI and core constructs MUST be app-scoped unless promoted to a properly versioned `libs/` package with strict boundaries.
- **FR-005**: Each feature MUST be packaged as a self-contained Angular module following the module structure rules.
- **FR-006**: Build and deploy pipelines MUST allow deploying remotes independently.

## Key Entities

- **App (shell/admin/member/management)**: independent deployable Angular application
- **Feature Module**: self-contained module inside an app

## Success Criteria

- **SC-001**: Shell can load each remote (`admin`, `member`, `management`) within 3 seconds under normal network conditions in staging.
- **SC-002**: Each remote builds and serves independently in developer environment (can be started alone).
- **SC-003**: Adding a new domain/app requires no changes to existing apps in >90% of typical cases.
- **SC-004**: No runtime imports between remotes exist (verified by static scan of imports at build time).

## Assumptions

- Module federation (or equivalent) will be used for runtime loading, but exact mechanism is implementation detail and out of scope for this spec.
- Existing CI can be extended to support independent remote deployments.
- Tailwind is acceptable at workspace level and teams agree on utility usage.
- **Greenfield workspace**: Building a brand-new workspace from scratch with shell + admin, member, and management remotes. No legacy monolith migration in scope.

## Clarifications

### Session 2026-04-29

- Q: How should remotes access authentication state and user identity? → A: Shell manages all auth; remotes receive tokens/identity via shell-provided service or URL params.
- Q: For shared non-business state (e.g., UI theme, locale, user sidebar data), should remotes subscribe to shell state or request it on-demand? → A: Remotes request data on-demand from shell API endpoints; no subscription or shared runtime state.
- Q: What criteria must a component or service meet before being extracted to a workspace-level `libs/` package shared across remotes? → A: Used by ≥2 remotes AND stable across 3+ releases AND approved via architecture review.
- Q: When a remote app fails to load or crashes at runtime, what should the shell do? → A: Show error banner/modal to user; log to centralized observability platform (e.g., Sentry); do NOT crash shell or other remotes.
- Q: Is this spec for a brand-new workspace, or are you migrating/refactoring an existing monolithic application? → A: Greenfield: Building brand new workspace from scratch with these 4 apps.

---

(End of spec)
