# Feature Specification: Module Federation Flow – Micro Frontend

**Feature Branch**: `002-module-federation-flow`  
**Created**: April 29, 2026  
**Status**: Draft  
**Input**: Define Shell (host) connecting with Admin, Member, and Management (remotes) using Module Federation

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigation from Shell to Admin Remote (Priority: P1)

Shell acts as the entry point and orchestrates navigation to Admin application. Users access the admin section by navigating through Shell's routing, which then dynamically loads the Admin remote and renders it without requiring a page reload.

**Why this priority**: Core foundation of micro frontend architecture; directly enables the multi-app experience

**Independent Test**: Can be tested by navigating to `/admin` route in Shell, verifying Admin remote loads dynamically, and Admin's internal features are accessible

**Acceptance Scenarios**:

1. **Given** user is on Shell homepage, **When** user navigates to `/admin`, **Then** Admin remote is loaded dynamically and Admin module is rendered
2. **Given** Admin remote is loaded, **When** user navigates within Admin (e.g., to `/admin/users`), **Then** Shell does NOT reload, only Admin's internal routing handles the navigation
3. **Given** user is in Admin, **When** user navigates back to Shell root via breadcrumb or link, **Then** Admin remote is unloaded and Shell root renders

---

### User Story 2 - Multi-Remote Navigation Flow (Priority: P1)

Users seamlessly switch between Admin, Member, and Management applications through Shell's unified routing without full page reloads or losing global state.

**Why this priority**: Essential user experience; defines the core multi-app navigation pattern

**Independent Test**: Can be tested by navigating between `/admin`, `/member`, and `/management` routes, verifying each remote loads independently and internal state is preserved within each remote

**Acceptance Scenarios**:

1. **Given** Admin remote is active, **When** user navigates to `/member`, **Then** Admin remote is unloaded, Member remote is loaded dynamically
2. **Given** user navigates between remotes multiple times, **When** user returns to previously visited remote, **Then** the remote's last internal route state is restored (or re-initialized per UX design)
3. **Given** multiple remotes are available, **When** user navigates to a non-existent route, **Then** Shell shows appropriate error page or redirects to default route

---

### User Story 3 - Lazy Loading of Remote Applications (Priority: P1)

Remotes are not bundled with Shell; they are loaded on-demand as users navigate to them, ensuring Shell's initial bundle size is minimal.

**Why this priority**: Performance critical; directly impacts initial load time and scalability

**Independent Test**: Can be tested by measuring Shell's initial bundle size (excludes remotes), verifying each remote bundle is only loaded when its route is accessed

**Acceptance Scenarios**:

1. **Given** Shell application loads, **When** Shell page is fully rendered, **Then** Admin, Member, and Management remote bundles are NOT loaded
2. **Given** no route to Admin has been accessed, **When** network tab is inspected, **Then** no Admin remote code is in Shell's initial payload
3. **Given** user navigates to `/member` route, **When** Member remote is requested, **Then** Member bundle is fetched and executed dynamically

---

### User Story 4 - Standalone Remote Execution (Priority: P2)

Each remote (Admin, Member, Management) can be executed independently on its own dev server without Shell, allowing isolated development and testing.

**Why this priority**: Essential for independent team development and local testing; enables parallel development

**Independent Test**: Can be tested by running Admin on standalone dev server, verifying Admin's features work identically to when loaded from Shell

**Acceptance Scenarios**:

1. **Given** Admin is running on standalone dev server (e.g., `http://localhost:4101`), **When** page loads, **Then** Admin's internal routing and features function completely
2. **Given** Member is running standalone, **When** admin navigates internal routes, **Then** no dependencies on Shell or other remotes cause errors
3. **Given** all three remotes are running standalone simultaneously, **When** each is accessed independently, **Then** all function without conflicts

---

### User Story 5 - Authentication & Authorization at Shell Level (Priority: P2)

Authentication is handled centrally at Shell level. Once user is authenticated in Shell, remotes validate access based on user's permissions without requiring separate login.

**Why this priority**: Security foundation; centralizes auth state and reduces duplication

**Independent Test**: Can be tested by logging into Shell, verifying authenticated state is accessible to remotes, and attempting unauthorized route access triggers redirect

**Acceptance Scenarios**:

1. **Given** unauthenticated user accesses Shell, **When** user navigates to protected route, **Then** user is redirected to login page
2. **Given** user is authenticated in Shell, **When** user navigates to `/admin`, **Then** Admin remote can verify user's authentication status without additional login
3. **Given** authenticated user lacks Admin role, **When** user attempts to access `/admin`, **Then** Admin remote's route guard blocks access and shows unauthorized message

---

### User Story 6 - Error Handling in Remote Loading (Priority: P2)

If a remote fails to load due to network error, bundle mismatch, or other issues, Shell displays user-friendly error message and prevents app crash.

**Why this priority**: Stability and reliability; ensures one remote's failure doesn't crash entire app

**Independent Test**: Can be tested by simulating remote loading failure and verifying Shell remains functional with error fallback UI

**Acceptance Scenarios**:

1. **Given** Admin remote bundle fails to download, **When** user navigates to `/admin`, **Then** Shell shows error message "Admin module unavailable" and provides option to retry or navigate elsewhere
2. **Given** Member remote throws runtime error during initialization, **When** error occurs, **Then** Shell remains functional and shows error boundary with helpful message
3. **Given** remote loading takes longer than timeout, **When** timeout expires, **Then** Shell shows loading timeout message instead of hanging indefinitely

---

### User Story 7 - Shared Dependencies Management (Priority: P2)

Angular core packages, RxJS, and common utilities are shared between Shell and remotes to avoid duplication, with version alignment enforced.

**Why this priority**: Bundle optimization and compatibility; reduces redundant code

**Independent Test**: Can be tested by analyzing bundle and verifying shared dependencies appear only once across Shell and all remotes

**Acceptance Scenarios**:

1. **Given** Shell and all remotes are built with Module Federation, **When** bundles are inspected, **Then** Angular core (>= X.X.X) is shared and appears in shared bundle, not duplicated in each app
2. **Given** version mismatch occurs in shared dependency (e.g., RxJS 7.x in Shell, 6.x in remote), **When** apps load, **Then** system either loads highest compatible version or shows version conflict error
3. **Given** new common utility is added to shared library, **When** Shell and remotes are rebuilt, **Then** utility is automatically shared without manual bundle adjustment

---

### User Story 8 - Deployment Independence (Priority: P2)

Shell and remotes can be deployed independently. Shell deployment does not require redeploying remotes, and remote deployment does not require redeploying Shell.

**Why this priority**: Operational efficiency; enables rapid iteration and reducing deployment risk

**Independent Test**: Can be tested by deploying Shell without redeploying remotes and verifying remotes still load; then deploy single remote and verify it's accessible without Shell redeployment

**Acceptance Scenarios**:

1. **Given** Admin remote is deployed to production, **When** Shell references old Admin remote entry point, **Then** Shell dynamically loads new Admin version (either automatically via version bump or through environment config)
2. **Given** Shell is redeployed with UI changes, **When** deployment completes, **Then** existing remotes continue to function without redeployment
3. **Given** version mismatch detected between Shell and remote at runtime, **When** incompatible versions are detected, **Then** system logs warning or shows graceful fallback (behavior per versioning strategy)

---

### Edge Cases

- What happens when user navigates to a remote route that no longer exists (remote updated, route changed)?
- How does system handle network latency when loading multiple remotes in sequence?
- What happens if a remote's shared dependency version is incompatible with Shell's version?
- Can user navigate back to previous remote using browser back button, and does previous remote state restore?
- What happens if Shell is offline but remote was previously cached?

---

## Requirements *(mandatory)*

### Functional Requirements

#### Module Federation Configuration

- **FR-001**: Shell MUST be configured as Module Federation host with dynamic import capability for Admin, Member, and Management remotes
- **FR-002**: Each remote (Admin, Member, Management) MUST expose a single entry module and one route entry point via Module Federation
- **FR-003**: Shell's webpack/build configuration MUST specify each remote's scope, exposed modules, and shared dependencies
- **FR-004**: Shell architecture MUST support extensibility for adding additional remotes (beyond initial 3) without major refactoring; remote configuration MUST be externalized and environment-specific

#### Routing & Navigation

- **FR-005**: Shell MUST maintain a route mapping that defines paths to each remote (e.g., `/admin` → Admin remote, `/member` → Member remote, `/management` → Management remote)
- **FR-006**: Shell MUST detect route changes and dynamically load the corresponding remote application
- **FR-007**: When user navigates to a remote route, Shell MUST load the remote's entry module and hand over internal routing to the remote
- **FR-008**: Each remote MUST manage its own internal routes independently without Shell intervention
- **FR-009**: Shell MUST provide navigation mechanism (e.g., menu, breadcrumbs) that allows users to switch between remotes

#### Lazy Loading

- **FR-010**: All remotes MUST be lazy loaded on route access; no remote code MUST be included in Shell's initial bundle
- **FR-011**: Remote bundles MUST only be fetched from network when user navigates to that remote's route
- **FR-012**: Shell MUST provide loading indicator while remote bundle is being fetched

#### Independent Execution

- **FR-013**: Each remote MUST be runnable standalone on its own development server without Shell dependency
- **FR-014**: Each remote MUST include its own routing configuration, so it can function independently
- **FR-015**: Each remote MUST not import or depend directly on other remotes' code

#### Communication Between Applications

- **FR-016**: Communication between Shell and remotes MUST occur via route navigation, API calls, or browser storage (when necessary)
- **FR-017**: Direct imports between remotes MUST NOT be allowed (each remote is independently compiled)
- **FR-018**: Remotes MAY communicate with each other via shared API calls, not direct state sharing

#### Authentication & Authorization

- **FR-019**: Authentication state MUST be maintained at Shell level and shared with remotes
- **FR-020**: Shell MUST enforce route guards at its level; if user is unauthenticated, user MUST NOT access protected Shell routes
- **FR-021**: Each remote MUST implement its own route guards to validate user's role/permissions before rendering protected content
- **FR-022**: If remote detects unauthorized access, remote MUST redirect to unauthorized page or Shell's auth module

#### Error Handling

- **FR-023**: If a remote fails to load (network error, bundle mismatch, etc.), Shell MUST catch the error and display user-friendly error message
- **FR-024**: Remote load failure MUST NOT crash Shell application; Shell MUST remain functional
- **FR-025**: Shell MUST provide fallback UI or error page when remote fails to load
- **FR-026**: If remote throws unhandled error during execution, error boundary or error handling service MUST catch it and display error message without crashing Shell

#### Remote Lifecycle Management

- **FR-027**: When user navigates away from a remote, Shell MUST unload the remote (destroy component, unsubscribe from observables, free memory)
- **FR-028**: Remote bundle code MUST be removed from DOM and memory when remote is unloaded
- **FR-029**: When user returns to a previously visited remote, remote MUST be re-initialized from fresh state (not restored from cache)

#### Shared Dependencies

- **FR-030**: Angular core packages (Angular core, common, platform-browser, etc.), RxJS, and common utility libraries MUST be configured as shared dependencies
- **FR-031**: All applications (Shell and remotes) MUST use the same version of shared dependencies to prevent conflicts
- **FR-032**: Shared dependencies MUST NOT be bundled with individual applications; they MUST be in a shared bundle
- **FR-033**: Shared library scope MUST be minimal: include only core infrastructure (authentication service, error handling utilities, shared types/interfaces, logging); feature-specific code MUST remain in remotes
- **FR-034**: Shared library bundle MUST NOT exceed 100 KB (gzipped) to maintain bundle optimization targets

#### Deployment

- **FR-035**: Shell MUST support deployment independently from remotes
- **FR-036**: Each remote MUST support independent deployment without requiring Shell redeployment
- **FR-037**: Remote entry points MUST be configurable via environment-specific configuration files (e.g., `remotes.dev.config.ts`, `remotes.prod.config.ts`), allowing Shell to locate remotes in different deployment environments (dev, staging, production) without code changes
- **FR-038**: Configuration file strategy MUST allow different remote URLs per environment (e.g., `http://localhost:4101` for dev, `https://cdn.prod.com/admin` for production)
- **FR-039**: Environment-specific configuration MUST be selected at build time and embedded in the final bundle

#### Versioning Strategy

- **FR-040**: Version information for remotes MUST be stored in Shell's configuration (e.g., remotes version map)
- **FR-041**: When incompatible version is detected between Shell and remote, system MUST handle it per versioning strategy (load highest compatible version, show warning, or prevent load)

### Non-Functional Requirements

- **NFR-001**: Initial Shell bundle size MUST NOT exceed 500 KB (gzipped) to ensure fast initial load
- **NFR-002**: Remote bundle size for each app MUST NOT exceed 1 MB (gzipped) to ensure acceptable lazy load time
- **NFR-003**: Time to interactive (TTI) for Shell MUST be under 3 seconds on 4G network
- **NFR-004**: Remote loading time MUST NOT exceed 5 seconds; if exceeded, timeout error is shown

### Key Entities

#### Shell (Host Application)

- **Purpose**: Entry point and orchestrator for the micro frontend architecture
- **Responsibilities**: 
  - Routing and navigation between remotes
  - Authentication state management
  - Shared layout (header, sidebar, footer)
  - Remote lifecycle management (loading, error handling)
  - Shared dependency configuration
- **Routes**: `/`, `/admin`, `/member`, `/management`, error routes
- **Deployment**: Independent deployment
- **Shared Exports**: None (consumes remotes only)

#### Admin Remote

- **Purpose**: Administration module for managing system configuration and users
- **Responsibilities**: 
  - Internal routing for admin features
  - Admin feature implementation
  - Admin-specific services and logic
  - Access control validation
- **Entry Route**: `/admin`
- **Exposed Module**: Admin App Component/Module with routing
- **Deployment**: Independent deployment
- **Shared Dependencies**: Angular core, RxJS, common utilities

#### Member Remote

- **Purpose**: Member portal module for member-facing features and services
- **Responsibilities**: 
  - Internal routing for member features
  - Member portal feature implementation
  - Member-specific services
  - Member authentication validation
- **Entry Route**: `/member`
- **Exposed Module**: Member App Component/Module with routing
- **Deployment**: Independent deployment
- **Shared Dependencies**: Angular core, RxJS, common utilities

#### Management Remote

- **Purpose**: Management module for operational and business management features
- **Responsibilities**: 
  - Internal routing for management features
  - Management feature implementation
  - Management-specific services
  - Role-based access control
- **Entry Route**: `/management`
- **Exposed Module**: Management App Component/Module with routing
- **Deployment**: Independent deployment
- **Shared Dependencies**: Angular core, RxJS, common utilities

---

## Success Criteria *(mandatory)*

1. **Users can navigate between Shell and all three remotes** — Measured by: Users can successfully load Shell → navigate to `/admin` → navigate to `/member` → navigate to `/management` and each remote renders correctly with no page reloads

2. **All remotes can run independently** — Measured by: Each of Admin, Member, and Management can be started on separate dev servers and function completely without Shell; zero dependency errors

3. **Shell's initial bundle excludes remote code** — Measured by: Shell's initial bundle size is at least 60% smaller than if all remotes were bundled together; webpack bundle analyzer confirms zero remote code in Shell initial chunk

4. **Remote loading is lazy and on-demand** — Measured by: Network tab shows remote bundle is only fetched when user navigates to that remote's route; subsequent navigations to same remote use cached bundle

5. **One remote's failure doesn't crash the app** — Measured by: Simulated remote load failure shows error message; user can navigate to other remotes and Shell remains fully functional

6. **Authentication flows end-to-end** — Measured by: Authenticated user can access protected routes in Shell and all remotes; unauthenticated user is redirected to login

7. **Shared dependencies are consolidated** — Measured by: Webpack bundle analysis confirms Angular, RxJS, and common utilities appear in single shared bundle, not duplicated per app; total bundle size reduction > 30%

8. **Independent deployments work** — Measured by: Deploy Shell without remotes, remotes load correctly; deploy updated remote without Shell, updated version is immediately available; zero downtime deployments

---

## Assumptions

- **Angular 16+** is used across all applications (Shell and remotes)
- **Nx monorepo** is used for managing Shell and remotes as separate projects
- **Module Federation** provided by `@nx/angular` or `@angular-architects/module-federation` package
- **All applications share Angular core** (>=16.0.0), RxJS (>=7.8.0), and project common utilities
- **Remotes are independently deployable** to the same CDN or different CDNs
- **Authentication service** exists at Shell level and provides auth state to remotes via service or shared storage
- **Error handling** uses Angular error boundaries or custom error boundary components
- **Versioning strategy** follows semantic versioning; shell maintains version map for remotes
- **Development and production** environments are configured similarly for consistent behavior
- **Shared library** contains only core infrastructure: auth service, error handling utilities, shared types/interfaces, logging; limited to ~100 KB (gzipped)
- **Architecture is extensible** – designed to support adding 10+ remotes via configuration without major code restructuring

---

## Implementation Considerations

- Module Federation configuration must be set up in webpack configuration for each application
- Remote entry points must be configured before build time with proper paths/URLs
- Shared dependency versions must match exactly across all applications to prevent runtime issues
- Error handling must cover network failures, bundle mismatches, incompatible versions, and runtime errors
- Performance monitoring should track remote loading times and bundle sizes
- Documentation should cover how to add new remotes, update versions, and deploy independently

---

## Clarifications

### Session 2026-04-29

- Q: What should be the performance targets for Shell bundle, remote bundles, and TTI? → A: Recommended (Shell: ≤500KB gzipped, Remotes: ≤1MB gzipped each, TTI: ≤3s on 4G)
- Q: How should remotes be managed in memory when users navigate between them? → A: Unload remotes when navigating away; destroy component and service instances; free memory; re-init on return
- Q: Should the architecture support adding more remotes beyond the initial 3 (Admin, Member, Management)? → A: Yes, design for extensibility; support adding 10+ remotes via configuration without code restructuring
- Q: Which utilities and code should be placed in the shared library (shared across Shell and remotes)? → A: Minimal scope – only core infrastructure (auth service, error utils, shared types, logging); feature code stays in remotes; ~50-100 KB shared bundle
- Q: How should remote entry point URLs be configured for different deployment environments? → A: Environment-specific configuration files (remotes.dev.config.ts, remotes.prod.config.ts); selected at build time; allows different URLs per environment without code changes

