# Tasks: Microfrontend Style (NX + Angular Enterprise)

**Phase 2+ Output** | **Date**: 2026-04-29 | **Branch**: `001-microfrontend-style`  
**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Data Model**: [data-model.md](data-model.md)

---

## Overview

**Feature**: Establish NX monorepo with independent, deployable Angular micro frontends (MFE)  
**Scope**: Shell (host) + 3 remotes (admin, member, management)  
**Approach**: Module federation for runtime loading; centralized auth in shell; remotes isolated  
**MVP**: Shell + Admin (US1); Member + Management in Phase 5  

### Task Organization

Tasks organized by completion phase with clear dependencies:
- **Phase 1**: Workspace Setup (NX init, dependencies, config)
- **Phase 2**: Foundational (Shell scaffolding, module federation, auth service)
- **Phase 3**: User Story 1 - Navigate to Admin (Admin app + load in shell)
- **Phase 4**: User Story 2 - Member Area (Member app + routes)
- **Phase 5**: Additional Remote (Management app)
- **Phase 6**: Polish & Cross-Cutting (Error handling, observability, CI/CD)

### Parallelization Opportunities

- Remotes (admin, member, management) scaffolding: [P] tasks run in parallel after Phase 2
- Feature module generation within remotes: [P] independent per module

### Test Criteria

Each user story independently testable:
- **US1**: `nx serve shell` → navigate `/admin` → admin loads and renders dashboard
- **US2**: `nx serve member` → internal routes work; or `nx serve shell` with member running separately → navigate `/member`

---

## Phase 1: Workspace Setup

**Goal**: Initialize NX monorepo with Angular, Tailwind, and TypeScript configuration.  
**Completion Test**: `nx list` shows NX plugins; `npx tsc --noEmit` passes.

- [ ] T001 Initialize NX monorepo workspace with `npm create nx-workspace@latest haut-spare-ui-all --preset=angular`
- [ ] T002 Install workspace dependencies in `package.json`: @angular/core, @angular/common, @nx/angular, typescript, tailwindcss, rxjs
- [ ] T003 Create workspace `tsconfig.base.json` with path aliases for apps and libs
- [ ] T004 Create workspace `tailwind.config.js` with content scans for `apps/*/src/**/*.{ts,html}` and `libs/**/*.{ts,html}`
- [ ] T005 Create workspace `.eslintrc.json` for linting Angular and TypeScript code
- [ ] T006 [P] Create `.github/workflows/` directory and setup GitHub Actions structure
- [ ] T007 Create `nx.json` with NX cache config and task runners for build, serve, test, lint

**Completion Check**: Workspace builds with `nx run-many --target=lint --all` (no errors in config)

---

## Phase 2: Foundational (Shell + Module Federation + Auth)

**Goal**: Scaffold shell application with module federation support and centralized authentication.  
**Blocking**: All remotes depend on these tasks.  
**Completion Test**: `nx serve shell` opens http://localhost:4200; shell serves without errors.

### 2.1 Shell Application Scaffolding

- [ ] T008 [P] Generate shell app: `nx generate @nx/angular:app shell --mfeType=host --style=scss --routing=true` in `apps/shell/`
- [ ] T009 Create shell module federation webpack config: `apps/shell/webpack.config.js` with host MFE setup
- [ ] T010 Create shell `app.module.ts` (root NgModule) with BrowserModule, AppRoutingModule, layout imports
- [ ] T011 Create shell `app-routing.module.ts` with lazy-loaded routes for `/admin`, `/member`, `/management` remotes
- [ ] T012 Create shell layout component: `apps/shell/src/app/layout/layout.component.ts|html|scss` (header, sidebar, router-outlet)
- [ ] T013 Create shell `app.component.ts` wrapping layout component at root level
- [ ] T014 Configure shell dev server to serve on `http://localhost:4200` via `project.json`

### 2.2 Authentication Service (Shell Core)

- [ ] T015 Create shell auth service: `apps/shell/src/app/core/auth/auth.service.ts` with methods:
  - `getToken(): Observable<string>`
  - `getUser(): Observable<User>`
  - `login(credentials): Observable<User>`
  - `refreshToken(): Observable<string>`
  - `logout()`
  - `isAuthenticated(): Observable<boolean>`
  - `hasRole(role): Observable<boolean>`
- [ ] T016 Create shell `User` model interface: `apps/shell/src/app/core/auth/user.model.ts` with id, username, email, roles
- [ ] T017 Create shell HTTP interceptor: `apps/shell/src/app/core/http-interceptor.ts` to:
  - Add `Authorization: Bearer [token]` header to all requests
  - Handle 401 Unauthorized responses by triggering token refresh
  - Add `X-Request-ID` header for request tracing
- [ ] T018 Create shell error boundary service: `apps/shell/src/app/core/error-boundary.service.ts` to:
  - Catch remote load failures
  - Log to Sentry (integration stub)
  - Display user-friendly error UI
- [ ] T019 Create shell error boundary component: `apps/shell/src/app/components/error-boundary/error-boundary.component.ts|html|scss`
- [ ] T020 Create shell guard: `apps/shell/src/app/core/auth.guard.ts` to protect routes based on authentication
- [ ] T021 Create shell role guard: `apps/shell/src/app/core/role.guard.ts` to protect routes based on user role
- [ ] T022 Setup shell HTTP interceptor provider in `app.module.ts`

### 2.3 Module Federation Configuration (All Apps)

- [ ] T023 Create shared module federation webpack config template: `.specify/templates/webpack.mfe.config.js`
  - Defines shared: @angular/core, @angular/common, @angular/router, rxjs (singleton: true)
- [ ] T024 Update shell `angular.json` to include webpack config for MFE build
- [ ] T025 Create TypeScript path alias configuration for remotes in `tsconfig.base.json`:
  - `@admin/*` → `apps/admin/src/`
  - `@member/*` → `apps/member/src/`
  - `@management/*` → `apps/management/src/`
  - `@app/shell/*` → `apps/shell/src/`

**Completion Check**: `nx serve shell` opens without errors; shell shows empty layout (no remotes loaded yet)

---

## Phase 3: User Story 1 - Navigate to Admin (P1)

**Goal**: Create admin remote app and load it in shell.  
**Independent Test**: `nx serve shell` + `nx serve admin` → navigate to `/admin` → admin dashboard renders.  
**Acceptance**: Given authenticated user, when visiting `/admin`, then admin remote loads and shows dashboard.

### 3.1 Admin Remote Scaffolding

- [ ] T026 [US1] Generate admin app: `nx generate @nx/angular:app admin --mfeType=remote --style=scss --routing=true` in `apps/admin/`
- [ ] T027 [US1] Create admin module federation webpack config: `apps/admin/webpack.config.js` with remote MFE setup
  - Exposes `./AdminModule` at `apps/admin/src/app/app.module.ts`
- [ ] T028 [US1] Create admin `app.module.ts` (root NgModule) exporting for remote federation
- [ ] T029 [US1] Create admin `app-routing.module.ts` with internal routes (e.g., `/dashboard`, `/users`)
- [ ] T030 [US1] Create admin layout component: `apps/admin/src/app/layout/layout.component.ts|html|scss`
- [ ] T031 [US1] Create admin `app.component.ts` wrapping layout at root level
- [ ] T032 [US1] Create admin core folder: `apps/admin/src/app/core/` with app-level interceptors (inherit auth from shell)
- [ ] T033 [US1] Create admin shared folder: `apps/admin/src/app/shared/` with app-internal reusable components stub

### 3.2 Admin Feature Modules (Dashboard)

- [ ] T034 [US1] [P] Create admin dashboard module: `apps/admin/src/app/modules/dashboard/` directory
- [ ] T035 [US1] [P] Create dashboard page component: `apps/admin/src/app/modules/dashboard/pages/dashboard-page/dashboard-page.component.ts|html|scss`
- [ ] T036 [US1] [P] Create dashboard routing module: `apps/admin/src/app/modules/dashboard/dashboard-routing.module.ts` with dashboard-page route
- [ ] T037 [US1] [P] Create dashboard module: `apps/admin/src/app/modules/dashboard/dashboard.module.ts` declaring page component

### 3.3 Shell Integration (Load Admin Remote)

- [ ] T038 [US1] Update shell `app-routing.module.ts` to load admin remote:
  ```
  loadChildren: () => import('admin/AdminModule').then(m => m.AppModule)
  ```
- [ ] T039 [US1] Update shell webpack config remotes section to include:
  ```
  admin: 'admin@http://localhost:4201/remoteEntry.js'
  ```
- [ ] T040 [US1] Test local dev setup: start shell + admin servers and verify admin loads at `/admin`

**Completion Check**: 
- `nx serve shell` on port 4200
- `nx serve admin` on port 4201
- Navigate to `http://localhost:4200/admin` and see admin dashboard component render

---

## Phase 4: User Story 2 - Member Area (P1)

**Goal**: Create member remote app and load in shell.  
**Independent Test**: `nx serve shell` + `nx serve member` → navigate to `/member/profile` → member profile renders.  
**Acceptance**: Given member user, when visiting `/member`, then member remote loads with internal routes accessible.

### 4.1 Member Remote Scaffolding

- [ ] T041 [US2] [P] Generate member app: `nx generate @nx/angular:app member --mfeType=remote --style=scss --routing=true` in `apps/member/`
- [ ] T042 [US2] [P] Create member module federation webpack config: `apps/member/webpack.config.js`
- [ ] T043 [US2] [P] Create member `app.module.ts` and `app-routing.module.ts` (similar to admin structure)
- [ ] T044 [US2] [P] Create member layout component: `apps/member/src/app/layout/layout.component.ts|html|scss`
- [ ] T045 [US2] [P] Create member core folder: `apps/member/src/app/core/`
- [ ] T046 [US2] [P] Create member shared folder: `apps/member/src/app/shared/`

### 4.2 Member Feature Modules (Profile)

- [ ] T047 [US2] [P] Create member profile module: `apps/member/src/app/modules/profile/` directory
- [ ] T048 [US2] [P] Create profile page component: `apps/member/src/app/modules/profile/pages/profile-page/profile-page.component.ts|html|scss`
- [ ] T049 [US2] [P] Create profile routing module: `apps/member/src/app/modules/profile/profile-routing.module.ts` with profile-page route
- [ ] T050 [US2] [P] Create profile module: `apps/member/src/app/modules/profile/profile.module.ts`

### 4.3 Shell Integration (Load Member Remote)

- [ ] T051 [US2] Update shell `app-routing.module.ts` to load member remote:
  ```
  loadChildren: () => import('member/AppModule').then(m => m.AppModule)
  ```
- [ ] T052 [US2] Update shell webpack config remotes section to include:
  ```
  member: 'member@http://localhost:4202/remoteEntry.js'
  ```

**Completion Check**:
- `nx serve shell` on port 4200
- `nx serve member` on port 4202
- Navigate to `http://localhost:4200/member/profile` and see member profile render

---

## Phase 5: Additional Remote - Management App

**Goal**: Create management remote app (completes 3-remote structure from spec).  
**Independently Testable**: Management runs standalone and loads in shell like admin/member.

### 5.1 Management Remote Scaffolding

- [ ] T053 [P] Generate management app: `nx generate @nx/angular:app management --mfeType=remote --style=scss --routing=true` in `apps/management/`
- [ ] T054 [P] Create management module federation webpack config: `apps/management/webpack.config.js`
- [ ] T055 [P] Create management `app.module.ts` and `app-routing.module.ts`
- [ ] T056 [P] Create management layout component: `apps/management/src/app/layout/layout.component.ts|html|scss`
- [ ] T057 [P] Create management core folder: `apps/management/src/app/core/`
- [ ] T058 [P] Create management shared folder: `apps/management/src/app/shared/`

### 5.2 Management Feature Module (Placeholder)

- [ ] T059 [P] Create management overview module: `apps/management/src/app/modules/overview/` directory
- [ ] T060 [P] Create overview page component: `apps/management/src/app/modules/overview/pages/overview-page/overview-page.component.ts|html|scss`
- [ ] T061 [P] Create overview routing and module files

### 5.3 Shell Integration (Load Management Remote)

- [ ] T062 Update shell webpack config remotes section to include management:
  ```
  management: 'management@http://localhost:4203/remoteEntry.js'
  ```

**Completion Check**: All 3 remotes (admin, member, management) load in shell independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Add error handling, observability, testing, CI/CD, and documentation.

### 6.1 Error Handling & Observability

- [ ] T063 Implement Sentry integration: `apps/shell/src/app/core/sentry-init.ts`
  - Initialize Sentry on app bootstrap
  - Configure error tracking with user context
- [ ] T064 Integrate error boundary service with Sentry: update `error-boundary.service.ts` to log to Sentry
- [ ] T065 Create error recovery UI: display retry button and alternate navigation when remote fails
- [ ] T066 Add error logging to shell HTTP interceptor for failed API calls
- [ ] T067 Create shell state API endpoint (stub): `GET /api/shell/state` returning theme, locale, preferences
- [ ] T068 Create shell state API endpoint (stub): `PUT /api/shell/state` for user preferences updates

### 6.2 Testing Setup

- [ ] T069 [P] Setup unit test suites for shell:
  - `apps/shell/src/app/core/auth/auth.service.spec.ts`
  - `apps/shell/src/app/core/error-boundary.service.spec.ts`
  - `apps/shell/src/app/layout/layout.component.spec.ts`
- [ ] T070 [P] Setup unit test suites for admin (mirrored for member/management later):
  - `apps/admin/src/app/modules/dashboard/pages/dashboard-page/dashboard-page.component.spec.ts`
  - `apps/admin/src/app/layout/layout.component.spec.ts`
- [ ] T071 Create e2e test for US1 (Navigate to Admin):
  - `apps/shell-e2e/src/e2e/navigate-admin.cy.ts` using Cypress
  - Test: shell loads → user navigates to /admin → admin remote loads and renders
- [ ] T072 Create e2e test for US2 (Member Area):
  - `apps/member-e2e/src/e2e/navigate-member.cy.ts`
  - Test: user navigates to /member/profile → member app loads with profile route

### 6.3 CI/CD Pipelines

- [ ] T073 Create shell build workflow: `.github/workflows/build-shell.yml`
  - Trigger: push to main, or manual
  - Build, lint, test, deploy to staging CDN
- [ ] T074 [P] Create admin build workflow: `.github/workflows/build-admin.yml`
- [ ] T075 [P] Create member build workflow: `.github/workflows/build-member.yml`
- [ ] T076 [P] Create management build workflow: `.github/workflows/build-management.yml`
- [ ] T077 Create shared CI script: `.github/scripts/build-app.sh` to reuse across all app workflows

### 6.4 Documentation

- [ ] T078 Create `ARCHITECTURE.md` at repo root describing MFE architecture and key decisions
- [ ] T079 Create `README.md` at repo root with setup, build, test, deploy instructions
- [ ] T080 Create per-app README.md (stub):
  - `apps/shell/README.md`
  - `apps/admin/README.md`
  - `apps/member/README.md`
  - `apps/management/README.md`
- [ ] T081 Update `.github/copilot-instructions.md` with implementation plan reference (already done; verify links work)

### 6.5 Environment Configuration

- [ ] T082 Create `.env.example` with environment variables for remoteEntry URLs:
  ```
  ADMIN_REMOTE_URL=http://localhost:4201/remoteEntry.js
  MEMBER_REMOTE_URL=http://localhost:4202/remoteEntry.js
  MANAGEMENT_REMOTE_URL=http://localhost:4203/remoteEntry.js
  SENTRY_DSN=https://...
  ```
- [ ] T083 Create `environment.ts` and `environment.prod.ts` for shell and each remote

---

## Task Summary

| Phase | Task Count | Purpose |
|-------|-----------|---------|
| Phase 1 - Workspace Setup | 7 | NX init, dependencies, config |
| Phase 2 - Foundational | 17 | Shell scaffolding, auth, MFE config |
| Phase 3 - US1 (Admin) | 15 | Admin app, dashboard module, shell integration |
| Phase 4 - US2 (Member) | 11 | Member app, profile module, shell integration |
| Phase 5 - Management | 10 | Management app scaffolding |
| Phase 6 - Polish | 20 | Error handling, testing, CI/CD, docs |
| **TOTAL** | **80** | Complete MFE feature implementation |

---

## Parallelization Strategy

### After Phase 2 (Foundational Complete):
- Remotes (admin, member, management) scaffolding: Run T026–T046 in parallel across 3 terminals
- Feature modules within each remote: Run T034–T035, T047–T048, T059–T060 in parallel

### After Phase 3 (Admin Complete):
- Member remote (Phase 4): Run T041–T050 in parallel
- Management remote (Phase 5): Run T053–T061 in parallel

### During Phase 6 (Polish):
- Unit tests (T069–T070): Run in parallel per app
- E2E tests (T071–T072): Run sequentially (depends on app servers)
- CI/CD workflows (T073–T076): Define in parallel, deploy sequentially to avoid conflicts

---

## MVP Scope (Phase 1–3)

For minimum viable product (can demo independently):
- Complete Phase 1: Workspace Setup (T001–T007)
- Complete Phase 2: Foundational (T008–T025)
- Complete Phase 3: US1 Navigation to Admin (T026–T040)

**Result**: Fully working shell + admin MFE; user can navigate to `/admin` and see admin dashboard.  
**Time Estimate**: ~3–5 days with 1–2 developers

---

## Dependencies & Blocking

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational - Shell + Auth + MFE Config) [BLOCKING ALL]
    ├─→ Phase 3 (US1 - Admin)
    ├─→ Phase 4 (US2 - Member)
    └─→ Phase 5 (Management)
    ↓
Phase 6 (Polish - Testing, CI/CD, Docs)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (MVP completion)  
**Parallel Work**: After Phase 2, phases 3/4/5 can proceed in parallel (different feature branches if multiple teams)

---

## Next Steps

1. Start Phase 1 (Workspace Setup): Run T001–T007
2. Verify: `nx list` and `tsc --noEmit` succeed
3. Proceed to Phase 2 (Foundational): Run T008–T025
4. Run all 3 remotes locally; verify module federation and routing work
5. Implement remaining phases incrementally

(End of tasks)
