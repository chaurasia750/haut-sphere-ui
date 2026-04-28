# ANGULAR NX MONOREPO CONSTITUTION (TAILWIND + RESPONSIVE + SINGLE HOSTING)

<!--
Sync Impact Report
- Version change: N/A → 1.0.0
- Modified principles:
	- [New] Monorepo Architecture & Single Hosting
	- [New] Library Discipline & Boundaries
	- [New] Routing, Lazy Loading & Shell Authority
	- [New] Tailwind CSS & Responsive-First Styling
	- [New] Governance, CI/CD, Security, Documentation
- Added sections: Tailwind CSS Constitution, Responsive Design Rules, Layout System
- Removed sections: none
- Templates requiring updates:
	- ⚠ .specify/templates/plan-template.md (constitution checks need concrete gates)
	- ⚠ .specify/templates/spec-template.md (feature template should reference naming + styling rules)
	- ⚠ .specify/templates/tasks-template.md (tasks must surface constitution gates)
	- ✅ .specify/templates/constitution-template.md (seed replaced by concrete constitution)
- Follow-up TODOs:
	- RATIFICATION_DATE: TODO(RATIFICATION_DATE) — confirm ratification date
	- Review CI pipelines to enforce Tailwind linting and lazy-loading checks
-->

## Core Principles

### I. Monorepo Architecture & Single Hosting
This workspace is an Nx monorepo composed of four independently buildable applications: `shell`, `admin`, `member`, and `management`.
- Rule: The `shell` application is the single hosting entry point and must own global routing, layout, and top-level guards.
- Rule: Applications MUST NOT directly depend on one another; all cross-app reuse MUST go through versioned libraries.
- Rule: Each application MUST be independently buildable and lazy-loadable.

### II. Library-First Reuse (UI, Shared, Core, Auth, Feature)
Libraries are the backbone of reuse and MUST be the only mechanism for sharing code across apps.
- Rule: `ui` libraries are strictly presentational (dumb components). No business logic allowed in `ui` libraries.
- Rule: `shared` libraries contain stateless models, types, and pure helpers only.
- Rule: `core` provides singletons (services, interceptors, global config) and MUST be imported only by `shell`.
- Rule: `auth` centralizes authentication and guards; feature libraries may call `auth` APIs but must not reimplement auth flows.
- Rule: `feature` libraries encapsulate domain modules intended for reuse by multiple apps.

### III. Routing, Hosting & Lazy Loading
Routing is centralized in `shell` and acts as the authority for navigation.
- Rule: Routes for apps are mounted as lazy-loaded routes under `shell` (`/admin`, `/member`, `/management`).
- Rule: No direct inter-app routing; all cross-app navigation goes through `shell` routes.
- Rule: Lazy loading of app entry points is mandatory; route guards and unauthorized redirects must be centralized in `shell`.

### IV. Styling: Tailwind CSS & Responsive-First
Tailwind is the only approved styling system for this workspace.
- Rule: No external CSS frameworks are allowed. Inline styles are disallowed except for unavoidable edge cases with a documented justification.
- Rule: Design is mobile-first; utilities-only usage is required. Custom CSS is permitted only when a Tailwind utility cannot express the need, and such cases must be documented.

### V. Governance, CI/CD, Security & Documentation
Strong governance ensures consistency, security, and quality across apps and libraries.
- Rule: CI must enforce build, lint, type checks, Tailwind linting, unit tests, and e2e where applicable; no merge to `main` without passing CI.
- Rule: Security best-practices (input validation, secrets handling, dependency updates) are mandatory.
- Rule: Every library and app MUST include concise documentation and architecture rationale.

## Development Standards

This section consolidates operational rules that apply across projects.

- State management: Use a consistent pattern (signals/store) across apps. Shared state MUST reside in libraries; duplicate state logic is prohibited.
- Component design: One responsibility per component; UI and logic must be separated. Components MUST be small and testable.
- Naming conventions: apps `admin`, `member`, `management` (lowercase); libraries feature-based; components PascalCase; file names kebab-case.
- API handling: All HTTP calls MUST go through injectable services. Interceptors must centralize headers and global error handling.
- Authentication/Authorization: Auth logic MUST be centralized in `auth` libraries; role-based access enforced by guards in `shell`.
- Performance: Lazy-load feature modules, avoid heavy dependencies, and monitor bundle size. Any large dependency requires documented justification.

## Conformance & Enforcement

Conformance is enforced via automated checks and review processes.

- Pull Requests: Structured commit messages, one feature per branch, mandatory code review, and passing CI required before merge.
- Branching: `main` → production, `develop` → integration, `feature/*` for features, `bugfix/*` for fixes.
- Linting & Tests: Linting (TS, Tailwind), unit tests, and critical integration tests are required in CI pipelines. No broken builds allowed.
- Documentation: Each module/library MUST include a short `README.md` describing purpose, public API, and usage examples.

## Governance

Amendments to this constitution require a documented change, a rationale, and approval via a PR with at least one approving reviewer and passing CI. Major or breaking governance changes require additional stakeholder sign-off.

- Versioning policy: Semantic versioning for the constitution. MAJOR for breaking governance changes, MINOR for added principles or sections, PATCH for wording/clarity fixes.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-04-29


