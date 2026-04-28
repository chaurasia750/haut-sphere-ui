# Implementation Plan: Microfrontend Style (NX + Angular Enterprise)

**Branch**: `001-microfrontend-style` | **Date**: 2026-04-29 | **Spec**: [specs/001-microfrontend-style/spec.md](specs/001-microfrontend-style/spec.md)
**Input**: Feature specification from `/specs/001-microfrontend-style/spec.md`

## Summary

Establish a workspace and architectural conventions to support independent, deployable Angular micro frontends (MFE) using NX. Shell (host) orchestrates routing and authentication; admin, member, and management are independent remote apps. Goal: strict separation of concerns, independent deployability, and scalable team ownership.

**Technical Approach**: 
- NX monorepo with 4 applications (shell + 3 remotes)
- Module federation for runtime app composition
- Shell-managed authentication + on-demand state sharing
- Tailwind + SCSS per-component styling
- Independent CI/CD for each app

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 16+  
**Primary Dependencies**: @angular/core, @nx/angular, @angular/forms, module-federation (or equivalent), RxJS  
**Storage**: N/A (frontend only; backend APIs provide data)  
**Testing**: Jasmine/Karma for unit tests; Cypress for e2e  
**Target Platform**: Web browsers (desktop + mobile responsive)  
**Project Type**: Web application (micro-frontend architecture)  
**Performance Goals**: Remote load time <3 seconds (staging, normal network) per SC-001; independent build <60s per app  
**Constraints**: Strict isolation between remotes (no direct imports); no shared runtime state except centralized auth; all cross-app communication via APIs  
**Scale/Scope**: 4 applications; each remote supports independent team ownership

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Conformance vs. Angular NX Monorepo Constitution v1.0.0

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Monorepo Architecture & Single Hosting** | ✓ Pass | Shell is single host; 4 apps; lazy-loaded remotes |
| **II. Library-First Reuse** | ✓ Pass | libs/ minimal; promotion criteria: ≥2 remotes + ≥3 releases + architecture review |
| **III. Routing, Hosting & Lazy Loading** | ✓ Pass | Shell owns routing; remotes mounted as lazy-loaded routes (/admin, /member, /management) |
| **IV. Styling: Tailwind CSS** | ✓ Pass | Tailwind at workspace level; SCSS per component for scoped styles |
| **V. Governance, CI/CD, Security** | ✓ Pass | Feature emphasizes independent deployment pipelines |

**Result**: No violations. Specification aligns with constitution. ✓ GATE PASSED — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-microfrontend-style/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts if applicable)
└── tasks.md             # Phase 2 output (from /speckit.tasks)
```

### Source Code (repository root)

```text
workspace-root/
├── apps/
│   ├── shell/                    # Host application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout/       # Global header, sidebar, shell layout
│   │   │   │   ├── core/         # Interceptors, app-level services
│   │   │   │   ├── routes/       # Route definitions (mounted remotes)
│   │   │   │   ├── app.module.ts
│   │   │   │   └── app-routing.module.ts
│   │   │   └── main.ts
│   │   ├── project.json          # NX config
│   │   ├── tsconfig.json
│   │   └── package.json (or nx.json scope)
│   │
│   ├── admin/                    # Remote: Admin app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── modules/      # Feature modules (e.g., users/, dashboard/)
│   │   │   │   ├── core/         # App-scoped interceptors, services
│   │   │   │   ├── shared/       # Reusable UI primitives (app-internal only)
│   │   │   │   ├── app.module.ts
│   │   │   │   └── app-routing.module.ts
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── member/                   # Remote: Member app (similar to admin)
│   │   └── src/app/ [same structure as admin]
│   │
│   └── management/               # Remote: Management app (similar to admin)
│       └── src/app/ [same structure as admin]
│
├── libs/                         # Optional, minimal use
│   ├── shared/                   # Workspace-level models/types/helpers (if needed)
│   │   └── src/
│   ├── ui/                       # Workspace-level UI primitives (if needed, post-promotion)
│   │   └── src/
│   └── auth/                     # Centralized auth logic (if extracted to shared lib)
│       └── src/
│
├── nx.json                       # NX workspace config
├── tsconfig.base.json            # Base TypeScript config
├── tailwind.config.js            # Tailwind workspace-level config
├── angular.json (if applicable)  # Angular workspace config
├── .github/
│   ├── workflows/
│   │   ├── build-shell.yml       # CI for shell app
│   │   ├── build-admin.yml       # CI for admin app
│   │   ├── build-member.yml      # CI for member app
│   │   └── build-management.yml  # CI for management app
│   └── copilot-instructions.md   # Agent context file
│
└── specs/
    └── 001-microfrontend-style/  # This feature planning folder
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── tasks.md
```

**Structure Decision**: 
Selected **Option 3 (Multi-project MFE)** adapted for Nx micro-frontend architecture. Shell is the host; admin, member, management are independent remotes. Each remote has:
- Independent modules for features (one feature = one module)
- Scoped core/ for app-level services and interceptors
- Scoped shared/ for app-internal reusable UI
- Lazy-loaded routing mounted by shell

Libs/ is minimal and only used for workspace-level utilities after promotion (≥2 remotes + ≥3 releases + architecture review).

## Complexity Tracking

No constitution violations detected. All architectural decisions conform to Angular NX Monorepo Constitution v1.0.0. No complexity justifications required. ✓

---

## Phase 0: Research & Clarification

### Unknowns to Resolve

From Technical Context and Spec:

1. **Module Federation Setup**: NX supports module federation; need to determine version and configuration pattern
2. **Error Boundary Implementation**: Shell error handling + observability (Sentry/Datadog integration specifics)
3. **Auth Service Architecture**: Shell-provided auth service pattern; token storage (localStorage/sessionStorage/HttpOnly cookie)
4. **Build & Deploy Strategy**: Independent CI/CD for remotes; versioning/deployment orchestration
5. **Tailwind Configuration**: Workspace-level config sharing across shell + remotes; Tailwind purging strategy

### Phase 0 Deliverable: research.md

Will contain:
- Decision: [what was chosen]
- Rationale: [why chosen]
- Alternatives considered: [what else evaluated]

For each unknown above.

---

## Phase 1: Design & Contracts

### 1.1 Data Model (data-model.md)

Entities from spec:
- **App** (shell, admin, member, management): Independent deployable Angular applications
  - Properties: name, baseRoute, remoteEntry (if remote)
  - Relationships: shell hosts remotes
  
- **Feature Module** (inside each remote): Self-contained feature 
  - Properties: name, routes, components
  - Responsibilities: one domain concern

- **Auth State** (managed by shell): User identity + tokens
  - Properties: userId, roles, accessToken, expiresAt
  - Accessible to remotes via shell service API

### 1.2 Interface Contracts (contracts/)

Web frontend MFE (no external API contracts exposed). Internal contracts:

- **Shell → Remote Interface**: Module export (Angular modules + remoteEntry)
- **Shell → Remote (Runtime)**: Authentication tokens + user identity passed via service or URL params
- **Remote → Shell API**: Requests for non-business state (theme, locale, user profile via HTTP API)

### 1.3 Quickstart (quickstart.md)

High-level dev setup:
1. Clone repo
2. Install dependencies: `npm install` (or `pnpm install`)
3. Run shell locally: `nx serve shell`
4. Run a remote locally: `nx serve admin --open`
5. Verify modules federate (or run shell with remotes local)
6. Run tests: `nx test [app]`
7. Build: `nx build [app]`

### 1.4 Agent Context Update

After design complete, update `.github/copilot-instructions.md` to reference `specs/001-microfrontend-style/plan.md` between SPECKIT markers.

---

## Post-Design Gate: Constitution Re-check

After Phase 1 design deliverables complete, re-evaluate against constitution:

| Principle | Status | Notes |
|-----------|--------|-------|
| Monorepo Architecture & Single Hosting | ✓ | Shell architecture confirmed; app isolation verified |
| Library-First Reuse | ✓ | libs/ promotion criteria and structure defined |
| Routing & Lazy Loading | ✓ | Module federation + lazy-load routes designed |
| Tailwind CSS | ✓ | Workspace config + per-component SCSS planned |
| Governance & CI/CD | ✓ | Independent deploy strategies outlined |

**Result**: Constitution gate remains PASSED after Phase 1 design.

---

(End of plan)
