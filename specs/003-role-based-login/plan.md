# Implementation Plan: Role-Based Login

**Branch**: `003-role-based-login` | **Date**: 2026-04-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-role-based-login/spec.md`

## Summary

Implement a login page in the shell application with role-based routing to admin, member, and management modules. Users authenticate via email/password, receive accessToken + refreshToken in httpOnly cookies, and are routed to their role-specific destination (admin for roles 1-2, member for role 3, manager for role 4). Session persists for 30 minutes with automatic token refresh; invalid roles trigger graceful error handling.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.2+  
**Primary Dependencies**: Angular Core, RxJS, @angular/router, @angular/forms, Angular HTTP Client  
**Storage**: httpOnly Secure SameSite cookies (backend-managed)  
**Testing**: Vitest (unit), Cypress (e2e)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Micro Frontend shell application (Webpack 5 Module Federation)  
**Performance Goals**: Login redirect within 2 seconds; error feedback within 500ms  
**Constraints**: Form validation before API call; 30-minute session timeout; 1000 concurrent login attempts/min supported  
**Scale/Scope**: 4 roles, 3 remote modules, shell-hosted login; integrated with existing shell routing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **PASS - All Principles Satisfied**

| Principle | Requirement | Implementation |
|-----------|-------------|-----------------|
| **I. Monorepo Architecture** | Login in shell as single entry point | ✅ Shell owns login page + role routing |
| **II. Library Reuse** | Auth logic in library, not duplicated | ✅ Auth service in `libs/shared/auth`, used by shell |
| **III. Routing & Lazy Loading** | Routes centralized in shell, remotes lazy-loaded | ✅ Shell routes to `/admin`, `/member`, `/management` based on roleId |
| **IV. Tailwind CSS** | Styling via Tailwind only | ✅ Login form styled with Tailwind utilities |
| **V. Governance** | Auth guards + role validation in shell | ✅ Router guards + backend role validation |

**Complexity Justification**: No violations; follows constitution exactly.

## Project Structure

### Documentation (this feature)

```text
specs/003-role-based-login/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── auth-request.md
│   ├── auth-response.md
│   └── role-routing.md
└── checklists/
    └── requirements.md
```

### Source Code Structure

```text
apps/shell/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── guards/
│   │   │       └── auth.guard.ts          # NEW: Role-based route guard
│   │   ├── features/
│   │   │   └── login/                     # NEW: Login feature module
│   │   │       ├── login.module.ts
│   │   │       ├── login-routing.module.ts
│   │   │       ├── pages/
│   │   │       │   └── login/
│   │   │       │       ├── login.component.ts
│   │   │       │       ├── login.component.html
│   │   │       │       └── login.component.scss
│   │   │       └── services/
│   │   │           └── login.service.ts   # Form + submission logic
│   │   ├── app-routing.module.ts          # UPDATED: Add login route
│   │   └── app.component.ts
│   └── main.ts
│
├── webpack.config.ts                     # UPDATED: No changes needed (cookies auto-sent)
└── project.json

libs/shared/auth/
├── src/
│   ├── lib/
│   │   ├── auth.service.ts                # UPDATED: Handle refresh tokens, session timeout
│   │   ├── auth.interceptor.ts            # UPDATED: Attach tokens to requests
│   │   ├── models/
│   │   │   ├── auth-response.model.ts     # NEW
│   │   │   ├── auth-request.model.ts      # NEW
│   │   │   └── role.enum.ts               # NEW: Enum for roles 1-4
│   │   └── index.ts
│   └── package.json
```

**Structure Decision**: Leverages existing Nx library structure; login feature in shell, auth logic in shared library. Router guards validate roles before routing to remote modules.
