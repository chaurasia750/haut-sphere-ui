# Research: Module Federation Flow – Micro Frontend

**Session**: April 29, 2026 | **Spec**: [spec.md](spec.md)

---

## Executive Summary

This document summarizes the clarifications conducted during the specification phase. All critical architectural decisions have been resolved and locked in. No "NEEDS CLARIFICATION" items remain.

---

## Clarifications Resolved (5 Critical Questions)

### Q1: Performance Targets → Resolved ✅

**Question**: What should be the performance targets for Shell bundle, remote bundles, and Time-to-Interactive (TTI)?

**Resolution**: 
- **Shell Initial Bundle**: ≤500 KB (gzipped) — Ensures fast load on 4G networks
- **Remote Bundle Size**: ≤1 MB (gzipped) each — Balances features with acceptable lazy-load times
- **Shell TTI (Time-to-Interactive)**: ≤3 seconds on 4G network — Meets modern web standards
- **Remote Loading Timeout**: ≤5 seconds — Prevents indefinite hangs on slow networks

**Rationale**: These targets are industry standard for modern SPAs and align with the micro frontend principle of minimal initial bundle. Lazy loading remote bundles on demand ensures Shell can be small while remotes remain feature-rich.

**Implications**: 
- Shell bundle must exclude all remote code (lazy loading mandatory)
- Shared library limited to ~50-100 KB to preserve Shell target
- Code-splitting and dead-code elimination required

---

### Q2: Remote Lifecycle Management → Resolved ✅

**Question**: How should remotes be managed in memory when users navigate between them?

**Resolution**: **Unload remotes when navigating away**
- Remote component is destroyed when user navigates to different remote
- All observables unsubscribed, services cleaned up, memory freed
- When user returns to previously visited remote, remote is re-initialized from fresh state
- No remote caching or state preservation

**Rationale**: 
- **Memory efficiency**: Prevents memory leaks from keeping multiple remotes in DOM
- **Clean state**: Avoids subtle bugs from stale remote state
- **Consistency**: Matches micro frontend best practice (each remote is independently deployable unit)
- **Simplicity**: No complex state transfer logic needed between remotes

**Alternatives Considered**:
- Keep remotes cached (higher memory cost, potential state inconsistency)
- Preload all remotes at startup (breaks lazy loading principle)
- Dynamic caching per remote (governance complexity)

**Implications**: 
- Shell must implement proper cleanup in route guards
- Each remote must be designed to initialize from clean state
- Performance monitoring should track unload/reload cycles

---

### Q3: Remote Scalability → Resolved ✅

**Question**: Should the architecture support adding more remotes beyond the initial 3 (Admin, Member, Management)?

**Resolution**: **Yes, design for extensibility — Support 10+ remotes via configuration**

**Architecture Decisions**:
- Remote definitions stored in environment-specific configuration files (not hardcoded)
- Route mapping in Shell supports dynamic remote loading
- Adding new remote requires config update only (no Shell code changes)
- Pattern: `<route-path>` → `<remote-entry-point-url>` in configuration

**Example Configuration** (`remotes.prod.config.ts`):
```typescript
export const remotes = {
  admin: 'https://cdn.prod.com/admin/remoteEntry.js',
  member: 'https://cdn.prod.com/member/remoteEntry.js',
  management: 'https://cdn.prod.com/management/remoteEntry.js',
  // Easily add more:
  reports: 'https://cdn.prod.com/reports/remoteEntry.js',
  analytics: 'https://cdn.prod.com/analytics/remoteEntry.js',
};
```

**Implications**:
- Shell routing logic must be generic (pattern-based, not per-remote)
- Remote URL management centralized in configuration
- New team can add remotes without Shell team involvement

---

### Q4: Shared Library Scope → Resolved ✅

**Question**: Which utilities and code should be placed in the shared library?

**Resolution**: **Minimal scope — Only core infrastructure (~50-100 KB)**

**What Goes In Shared Library**:
- ✅ Authentication service (login, logout, token management)
- ✅ Error handling utilities (error interceptor, error display)
- ✅ Shared TypeScript interfaces/types (User, AuthToken, ApiResponse)
- ✅ Logging service (centralized logging)
- ✅ Angular core & RxJS (always shared)

**What Does NOT Go In Shared Library**:
- ❌ Feature-specific components (Admin forms, Member cards, etc.)
- ❌ Feature services (UserService stays in admin, MemberService in member)
- ❌ UI component libraries (each remote has own component library)
- ❌ State management (each remote manages own state)
- ❌ Business logic

**Rationale**:
- **Micro frontend principle**: Each remote is independently valuable
- **Bundle optimization**: Keeps shared bundle minimal
- **Decoupling**: Remotes remain independent; changes to one don't cascade
- **Governance**: Clear ownership (infrastructure vs. feature code)

**Implications**:
- Create `libs/shared/auth/` with service and guards only
- Create `libs/shared/errors/` with error handling utilities
- Create `libs/shared/types/` with common TypeScript types
- Feature code STAYS in remotes (no sharing)

---

### Q5: Environment Configuration Strategy → Resolved ✅

**Question**: How should remote entry point URLs be configured for different environments?

**Resolution**: **Environment-specific configuration files selected at build time**

**Configuration Strategy**:
- Create separate config files per environment: `remotes.dev.config.ts`, `remotes.prod.config.ts`, `remotes.staging.config.ts`
- Environment selected at build time (no rebuild needed for deployment)
- Config file imported and used by Shell's remote loader service

**Example Structure**:
```
shell/src/environments/
├── remotes.dev.config.ts
│   # admin: 'http://localhost:4101'
│   # member: 'http://localhost:4102'
│   # management: 'http://localhost:4103'
│
├── remotes.staging.config.ts
│   # admin: 'https://staging-cdn.company.com/admin/...'
│   # member: 'https://staging-cdn.company.com/member/...'
│   # management: 'https://staging-cdn.company.com/management/...'
│
└── remotes.prod.config.ts
    # admin: 'https://cdn.company.com/admin/...'
    # member: 'https://cdn.company.com/member/...'
    # management: 'https://cdn.company.com/management/...'
```

**Build Process**:
```bash
# Dev
ng build shell --configuration development  # Uses remotes.dev.config.ts

# Staging  
ng build shell --configuration staging      # Uses remotes.staging.config.ts

# Production
ng build shell --configuration production   # Uses remotes.prod.config.ts
```

**Alternatives Considered**:
- Runtime config from API (complexity, additional network call)
- Environment variables injected at build (same result, less clear governance)
- Hardcoded URLs (breaks flexibility, requires rebuild per environment)

**Implications**:
- Shell must import config file and use it in module-federation config
- Each environment has explicit remote URL definitions
- Deployment teams can see exact URLs being used per environment

---

## Design Decisions Summary

| Decision | Chosen | Impact |
|----------|--------|--------|
| **Performance** | 500KB Shell / 1MB Remotes / 3s TTI | Aggressive but achievable; drives minimal shared lib |
| **Remote Lifecycle** | Unload on navigate | Memory efficient; simple state management |
| **Scalability** | Support 10+ remotes | Config-driven; extensible without code changes |
| **Shared Code** | Minimal (auth, errors, types only) | ~50-100 KB shared bundle; high remote autonomy |
| **Env Config** | Config files per environment | Clear, explicit; no rebuild needed for deployment |

---

## Next Steps (Phase 1)

1. **Generate data-model.md** — Define entities, types, state management patterns
2. **Create contracts/** — Document Shell-to-Remote interface contract
3. **Generate quickstart.md** — Step-by-step setup guide for developers
4. **Update agent context** — Link plan to copilot instructions

---

## Document References

- **Specification**: [spec.md](spec.md)
- **Implementation Plan**: [plan.md](plan.md)
- **Data Model**: [data-model.md](data-model.md) (Phase 1 output)
- **Contracts**: [contracts/](contracts/) (Phase 1 output)
- **Getting Started**: [quickstart.md](quickstart.md) (Phase 1 output)

