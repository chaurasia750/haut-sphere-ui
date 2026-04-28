# Implementation Plan: Module Federation Flow – Micro Frontend

**Branch**: `002-module-federation-flow` | **Date**: April 29, 2026 | **Spec**: [specs/002-module-federation-flow/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-module-federation-flow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

**Objective**: Establish Module Federation-based micro frontend architecture enabling Shell (host) to dynamically load Admin, Member, and Management (remotes) with independent deployment, lazy loading, and unified authentication.

**Primary Approach**: Configure Nx + Angular 16+ with Module Federation; implement environment-specific remote URL configuration; design unload/reinit remote lifecycle; establish minimal shared library (auth, errors, types); enable 10+ remote extensibility via configuration.

**Key Performance Targets**: Shell ≤500KB | Remotes ≤1MB each | TTI ≤3s (4G) | Timeout ≤5s

## Technical Context

**Language/Version**: Angular 16+ with TypeScript 4.9+  
**Primary Dependencies**: @nx/angular, @angular-architects/module-federation, RxJS 7.8+  
**Storage**: N/A (stateless micro frontend orchestration)  
**Testing**: Nx test (Jest for unit), Playwright for E2E  
**Target Platform**: Web browser (desktop + mobile responsive)  
**Project Type**: Monorepo with 4 Angular SPAs (1 host + 3 remotes)  
**Performance Goals**: 3s TTI on 4G | 60% bundle reduction via lazy loading | <100KB shared library  
**Constraints**: Remotes unload on navigation (memory efficient) | Shared lib minimal scope | Extensible for 10+ remotes  
**Scale/Scope**: 3 remotes initially (Admin, Member, Management) | Extensible architecture | ~41 functional requirements | 8 user stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Alignment Assessment

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Monorepo Architecture** | Shell must own global routing; apps independent; lazy-load mandate | ✅ PASS | Shell configured as host; remotes as lazy-loaded routes; no direct inter-app dependencies |
| **II. Library Discipline** | ui/shared/core/auth/feature boundaries enforced | ✅ PASS | Shared library minimal (auth, errors, types); feature code in remotes; clear boundaries |
| **III. Routing Authority** | Routes centralized in shell; no direct inter-app routing | ✅ PASS | Shell maintains route mapping (`/admin`, `/member`, `/management`); remotes unaware of shell routing |
| **IV. Lazy Loading Mandate** | All remotes lazy-loaded; no bundling with shell | ✅ PASS | FR-009-011 mandate lazy loading; remote bundles fetched on-demand; 0 remote code in shell initial bundle |
| **V. Tailwind CSS** | No external CSS frameworks; Tailwind only | ✅ PASS (Future) | Not in scope for Phase 1; styling handled by individual remotes; constraint noted for future work |

### Gate Status
✅ **PASS** – Feature aligns with all constitutional principles. No violations. Ready for Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/002-module-federation-flow/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (Phase 1 output)
├── research.md          # Phase 0 output (clarifications resolved)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (getting started)
├── contracts/           # Phase 1 output (public API contracts)
│   ├── shell-contract.md
│   └── remote-contract.md
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository structure)

```text
apps/
├── admin/               # Remote application
│   ├── src/
│   │   ├── app/
│   │   ├── module-federation.config.ts
│   │   └── main.ts
│   └── project.json
├── member/              # Remote application
│   ├── src/
│   │   ├── app/
│   │   ├── module-federation.config.ts
│   │   └── main.ts
│   └── project.json
├── management/          # Remote application
│   ├── src/
│   │   ├── app/
│   │   ├── module-federation.config.ts
│   │   └── main.ts
│   └── project.json
└── shell/               # Host application
    ├── src/
    │   ├── app/
    │   │   ├── app-routing.module.ts    # Central route mapping
    │   │   ├── remote-loader.service.ts # Remote loading logic
    │   │   └── shell.component.ts       # Layout shell
    │   ├── environments/
    │   │   ├── remotes.dev.config.ts    # Dev remote URLs
    │   │   └── remotes.prod.config.ts   # Prod remote URLs
    │   ├── module-federation.config.ts  # Host config
    │   └── main.ts
    └── project.json

libs/
├── shared/              # Minimal shared library (~50-100 KB)
│   └── auth/            # Authentication service & guards
│   └── errors/          # Error handling utilities
│   └── types/           # Shared TypeScript interfaces
│   └── logging/         # Logging service
```

**Structure Decision**: Angular Nx monorepo with shell host and 3 remotes as independent apps. Remotes lazy-loaded via Module Federation. Minimal shared library for infrastructure (auth, errors, types, logging). Environment-specific remote URL configuration files enable deployment flexibility.

## Complexity Tracking

**No violations** – Feature fully aligns with constitution. No justification needed.

---

## Phase 0: Research – Clarifications Summary

All critical clarifications were resolved during the `/speckit.clarify` session. See [research.md](research.md) for detailed findings.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
