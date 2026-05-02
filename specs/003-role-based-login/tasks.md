# Tasks: Role-Based Login

**Input**: Design documents from `/specs/003-role-based-login/`  
**Branch**: `003-role-based-login`  
**Completion Criteria**: All tasks implemented, tested, and approved  
**Test Coverage**: Unit tests (>80%), integration tests, e2e tests for each user story

---

## Phase 1: Setup & Infrastructure

**Purpose**: Project initialization and shared infrastructure for authentication

### Task List

- [x] T001 Create directory structure for login feature in `apps/shell/src/app/features/login/`
- [x] T002 [P] Create directory structure for authentication library in `libs/shared/auth/src/lib/`
- [x] T003 [P] Create directory structure for router guards in `apps/shell/src/app/core/guards/`
- [x] T004 [P] Generate Angular library `@libs/shared/auth` with barrel export in `libs/shared/auth/src/index.ts`
- [x] T005 [P] Update `tsconfig.base.json` to add path alias `@libs/shared/auth` pointing to `libs/shared/auth/src/index.ts`
- [x] T006 [P] Create `libs/shared/auth/package.json` with library metadata
- [x] T007 Create `.eslintrc.json` in `libs/shared/auth/` for linting configuration
- [x] T008 Create README.md in `libs/shared/auth/` documenting library purpose and public API

---

## Phase 2: Foundational Authentication Models & Types

**Purpose**: Define shared data models that support all user stories

### Task List

- [x] T009 [P] Create Role enum in `libs/shared/auth/src/lib/models/role.enum.ts` with isValidRole() validator function
- [x] T010 [P] Create AuthRequest interface in `libs/shared/auth/src/lib/models/auth-request.model.ts`
- [x] T011 [P] Create AuthResponse interface in `libs/shared/auth/src/lib/models/auth-response.model.ts`
- [x] T012 [P] Create LoginError interface in `libs/shared/auth/src/lib/models/login-error.model.ts` with error codes and user messages
- [x] T013 [P] Create Session interface in `libs/shared/auth/src/lib/models/session.model.ts` with role and authentication state
- [x] T014 [P] Export all models from `libs/shared/auth/src/lib/models/index.ts`
- [x] T015 Create unit tests for role validation in `libs/shared/auth/src/lib/models/role.enum.spec.ts` (test all 4 roles + invalid role handling)
- [x] T016 [P] Create authentication service `libs/shared/auth/src/lib/auth.service.ts` with session$ BehaviorSubject and login() method stub
- [x] T017 [P] Create HTTP interceptor `libs/shared/auth/src/lib/auth.interceptor.ts` for handling 401 responses

---

## Phase 3: User Story 1 - User Authentication (Priority: P1)

**Goal**: Users can log in with email/password credentials and receive authentication tokens

**Independent Test**: Verify login form validation, submission to backend, and token receipt works correctly

**Acceptance Criteria**:
1. ✅ Login page displays email and password input fields
2. ✅ Form validation prevents empty field submission
3. ✅ Form validation prevents invalid email format submission
4. ✅ User submits valid credentials and receives AuthResponse with roleId
5. ✅ Login form clears after successful submission
6. ✅ User can retry after invalid credentials error

### Task List

- [x] T018 [US1] Create LoginComponent in `apps/shell/src/app/features/login/pages/login/login.component.ts` with reactive form (email, password)
- [x] T019 [US1] [P] Create LoginComponent template in `apps/shell/src/app/features/login/pages/login/login.component.html` with form fields and validation feedback
- [x] T020 [US1] [P] Create LoginComponent styles in `apps/shell/src/app/features/login/pages/login/login.component.scss` using Tailwind CSS utilities
- [x] T021 [US1] Create LoginService in `apps/shell/src/app/features/login/services/login.service.ts` for form state management
- [x] T022 [US1] Implement auth.service.ts login() method in `libs/shared/auth/src/lib/auth.service.ts` to POST credentials and handle AuthResponse
- [x] T023 [US1] [P] Implement email validation in ReactiveForm: Validators.required + Validators.email pattern
- [x] T024 [US1] [P] Implement password validation in ReactiveForm: Validators.required
- [x] T025 [US1] [P] Implement form submission handler that calls AuthService.login() and prevents double-submit
- [x] T026 [US1] [P] Implement form reset after successful login (clear email, password, errors)
- [x] T027 [US1] Create LoginComponent unit test `apps/shell/src/app/features/login/pages/login/login.component.spec.ts` - test empty field validation
- [x] T028 [US1] [P] Add test: invalid email format validation prevents submission
- [x] T029 [US1] [P] Add test: valid form allows submission
- [x] T030 [US1] Create LoginService unit test `apps/shell/src/app/features/login/services/login.service.spec.ts` - test form state management
- [x] T031 [US1] Add integration test `apps/shell/src/app/features/login/login.integration.spec.ts` - test login form → auth service → successful submission flow
- [x] T032 [US1] [P] Add integration test: invalid credentials error handling
- [x] T033 [US1] [P] Add integration test: form clears after successful login
- [x] T034 [US1] Create e2e test `apps/shell-e2e/src/login-happy-path.cy.ts` - test valid login submission and redirect
- [x] T035 [US1] [P] Add e2e test: invalid credentials error display

---

## Phase 4: User Story 2 - Admin Role Routing (Priority: P2)

**Goal**: Users with role ID 1 or 2 are automatically routed to `/admin` module after successful login

**Independent Test**: Verify role-based routing works for roles 1 and 2, users see admin module

**Acceptance Criteria**:
1. ✅ Role 1 user logs in and is routed to `/admin`
2. ✅ Role 2 user logs in and is routed to `/admin`
3. ✅ Router guard prevents unauthenticated access to `/admin`
4. ✅ Invalid role (not 1-4) redirects to login with error message

### Task List

- [x] T036 [US2] Create RoleGuard in `apps/shell/src/app/core/guards/auth.guard.ts` implementing CanActivateFn
- [x] T037 [US2] Implement RoleGuard: check isAuthenticated() before allowing route access
- [x] T038 [US2] Implement RoleGuard: validate user roleId matches route requiredRoles (data.roles)
- [x] T039 [US2] Implement RoleGuard: redirect to login if not authenticated
- [x] T040 [US2] [P] Implement RoleGuard: redirect to /unauthorized if role doesn't match (but authenticated)
- [x] T041 [US2] Implement role-route mapping in `apps/shell/src/app/app-routing.module.ts`: roles 1 and 2 → `/admin`
- [x] T042 [US2] Add RoleGuard to `/admin` route with data.roles = [1, 2]
- [x] T043 [US2] Implement navigation logic in LoginComponent: after successful login, call router.navigate([roleRouteMap[roleId]])
- [x] T044 [US2] Create helper function in LoginComponent: getRoleRoute(roleId: number): string (maps 1-2→/admin)
- [x] T045 [US2] Create RoleGuard unit tests `apps/shell/src/app/core/guards/auth.guard.spec.ts` - test authenticated user with role 1 allowed
- [x] T046 [US2] [P] Add test: authenticated user with role 2 allowed to access /admin
- [x] T047 [US2] [P] Add test: unauthenticated user redirected to /login
- [x] T048 [US2] [P] Add test: role 3 user denied access to /admin route
- [x] T049 [US2] Create integration test: role 1 user login → route to /admin
- [x] T050 [US2] [P] Add integration test: role 2 user login → route to /admin
- [x] T051 [US2] Create e2e test `apps/shell-e2e/src/admin-role-routing.cy.ts` - role 1 login → /admin module visible
- [x] T052 [US2] [P] Add e2e test: role 2 login → /admin module accessible

---

## Phase 5: User Story 3 - Member Role Routing (Priority: P2)

**Goal**: Users with role ID 3 are automatically routed to `/member` page after successful login

**Independent Test**: Verify role 3 users are routed to member module and can access member content

**Acceptance Criteria**:
1. ✅ Role 3 user logs in and is routed to `/member`
2. ✅ Router guard prevents users with other roles from accessing `/member`
3. ✅ Member module content displays correctly for role 3

### Task List

- [x] T053 [US3] Implement role-route mapping in `apps/shell/src/app/app-routing.module.ts`: role 3 → `/member`
- [x] T054 [US3] Add RoleGuard to `/member` route with data.roles = [3]
- [x] T055 [US3] Update getRoleRoute() helper in LoginComponent to include role 3 → `/member` mapping
- [x] T056 [US3] Create unit test: RoleGuard allows role 3 user to access /member
- [x] T057 [US3] [P] Add unit test: role 1/2/4 users denied access to /member
- [x] T058 [US3] Create integration test: role 3 user login → route to /member
- [x] T059 [US3] Create e2e test `apps/shell-e2e/src/member-role-routing.cy.ts` - role 3 login → /member module visible

---

## Phase 6: User Story 4 - Manager Role Routing (Priority: P2)

**Goal**: Users with role ID 4 are automatically routed to `/management` module after successful login

**Independent Test**: Verify role 4 users are routed to management module and can access manager content

**Acceptance Criteria**:
1. ✅ Role 4 user logs in and is routed to `/management`
2. ✅ Router guard prevents users with other roles from accessing `/management`
3. ✅ Management module content displays correctly for role 4

### Task List

- [x] T060 [US4] Implement role-route mapping in `apps/shell/src/app/app-routing.module.ts`: role 4 → `/management`
- [x] T061 [US4] Add RoleGuard to `/management` route with data.roles = [4]
- [x] T062 [US4] Update getRoleRoute() helper in LoginComponent to include role 4 → `/management` mapping
- [x] T063 [US4] Create unit test: RoleGuard allows role 4 user to access /management
- [x] T064 [US4] [P] Add unit test: role 1/2/3 users denied access to /management
- [x] T065 [US4] Create integration test: role 4 user login → route to /management
- [x] T066 [US4] Create e2e test `apps/shell-e2e/src/manager-role-routing.cy.ts` - role 4 login → /management module visible

---

## Phase 7: User Story 5 - Login Error Handling (Priority: P3)

**Goal**: Users receive clear, appropriate error messages for different login failure scenarios

**Independent Test**: Verify error messages display correctly and users can retry after errors

**Acceptance Criteria**:
1. ✅ Invalid credentials (401) show "Invalid email or password"
2. ✅ Server errors (500+) show generic error message
3. ✅ Invalid role ID (roleId not in 1-4) shows generic "Unable to access system at this time"
4. ✅ User can retry login after error
5. ✅ Error messages clear when user changes form input

### Task List

- [x] T067 [US5] Implement error mapping in AuthService.login(): 401 → "Invalid credentials", 500+ → "System unavailable"
- [x] T068 [US5] Implement error mapping in LoginComponent: handle catchError from AuthService and set errorMessage
- [x] T069 [US5] Implement invalid role detection in AuthResponse handler: check isValidRole(response.roleId)
- [x] T070 [US5] Implement invalid role error message in LoginComponent: show generic message and log server-side event
- [x] T071 [US5] Implement error message clearing in LoginComponent: clear on form input change
- [x] T072 [US5] Add error message UI to LoginComponent template: display error in alert box if errorMessage is set
- [x] T073 [US5] [P] Update LoginComponent template: add aria-live="polite" to error message for accessibility
- [x] T074 [US5] Create unit test: 401 error maps to correct user message
- [x] T075 [US5] [P] Add test: 500 error maps to generic system error message
- [x] T076 [US5] [P] Add test: invalid roleId treated as error
- [x] T077 [US5] [P] Add test: error message clears when form input changes
- [x] T078 [US5] Create integration test: invalid credentials error flow
- [x] T079 [US5] [P] Add test: server error during login flow
- [x] T080 [US5] Create e2e test `apps/shell-e2e/src/login-error-handling.cy.ts` - invalid credentials error display
- [x] T081 [US5] [P] Add e2e test: server error handling and retry

---

## Phase 8: Session Management & Token Handling

**Purpose**: Implement session persistence, token refresh, and timeout functionality

### Task List

- [x] T082 [P] Implement AuthService.getSession$(): Observable<Session | null> to expose session state
- [x] T083 [P] Implement AuthService.isAuthenticated(): boolean to check current session validity
- [x] T084 [P] Implement AuthService.getCurrentRole(): number | null to retrieve user's role
- [x] T085 Implement AuthService session validation on app startup: call validateSession() in constructor
- [x] T086 Create `/api/auth/validate` endpoint contract in `libs/shared/auth/src/lib/models/auth-validate.model.ts`
- [x] T087 Implement session validation HTTP call to `/api/auth/validate` on app init
- [x] T088 [P] Implement session timeout tracking: store expiresAt timestamp and check expiry
- [x] T089 [P] Implement token refresh logic: exchange refreshToken for new accessToken before expiry
- [x] T090 Implement HTTP interceptor to attach accessToken to all outgoing requests (if needed; cookies auto-sent)
- [x] T091 Implement HTTP interceptor to handle 401 responses: redirect to login if session invalid
- [x] T092 [P] Implement logout endpoint call: POST to `/api/auth/logout` and clear session
- [x] T093 [P] Add logout button to shell app header/navigation
- [x] T094 Create unit tests for session management: test session persistence across component lifecycle
- [x] T095 [P] Add test: session validation on app init
- [x] T096 [P] Add test: 401 response triggers redirect to login
- [x] T097 Create integration test: full login → authenticated requests → logout flow

---

## Phase 9: Invalid Role Handling & Edge Cases

**Purpose**: Gracefully handle unexpected role IDs and concurrent login scenarios

### Task List

- [x] T098 Implement invalid role detection in RoleGuard: check if roleId is valid (1-4) and redirect if not
- [x] T099 [P] Implement invalid role error page component in `apps/shell/src/app/features/error/pages/invalid-role/`
- [x] T100 [P] Create route `/error/invalid-role` in app-routing.module.ts
- [x] T101 Implement server-side logging of invalid role assignments (backend task, but document in contract)
- [x] T102 [P] Implement concurrent login handling: invalidate previous session when new login detected
- [x] T103 [P] Add test: concurrent login from two browsers/tabs invalidates first session
- [x] T104 Create e2e test: invalid role ID handling (manual backend setup required)
- [x] T105 [P] Add e2e test: concurrent login scenario

---

## Phase 10: Cross-Cutting Concerns & Polish

**Purpose**: Complete non-functional requirements, accessibility, and code quality

### Task List

- [x] T106 [P] Implement responsive design for login page: test on mobile (320px), tablet (768px), desktop (1024px+)
- [x] T107 [P] Verify Tailwind CSS usage only (no inline styles or external CSS)
- [x] T108 [P] Add ARIA labels to form inputs and error messages for screen reader accessibility
- [x] T109 [P] Test keyboard navigation: Tab through form fields, Enter to submit
- [x] T110 [P] Add loading state UI: disable form inputs, show spinner during login attempt
- [x] T111 [P] Implement 2-second timeout target for login redirect (measure with performance.mark/measure)
- [x] T112 [P] Implement 500ms error feedback timeout (ensure error displayed within 500ms of request)
- [x] T113 Create performance test: measure login → redirect time (should be < 2 seconds)
- [x] T114 [P] Run ESLint on all new files: `nx lint shell` and `nx lint @libs/shared/auth`
- [x] T115 [P] Run TypeScript type checking: ensure no `any` types in auth code
- [x] T116 [P] Achieve >80% code coverage for AuthService: `nx test @libs/shared/auth --coverage`
- [x] T117 [P] Achieve >80% code coverage for LoginComponent: `nx test shell --coverage`
- [x] T118 Update `libs/shared/auth/README.md` with usage examples and API documentation
- [x] T119 [P] Update `apps/shell/README.md` to document login feature integration
- [x] T120 Create IMPLEMENTATION_STATUS.md in `specs/003-role-based-login/` tracking completion

---

## Phase 11: Integration & Validation

**Purpose**: Verify all components work together and meet acceptance criteria

### Task List

- [x] T121 Run full test suite: `nx run-many --target=test --all`
- [x] T122 [P] Run full e2e suite: `nx run-many --target=e2e --all`
- [x] T123 [P] Run linting: `nx run-many --target=lint --all`
- [x] T124 [P] Build shell app: `nx build shell --production`
- [x] T125 [P] Build auth library: `nx build @libs/shared/auth --production`
- [x] T126 Verify all user stories independently testable and passing
- [x] T127 [P] Verify all acceptance criteria met for each user story
- [x] T128 [P] Verify measurable outcomes achieved (2-second redirect, 500ms error feedback, etc.)
- [x] T129 Create PR with all changes and reference spec.md + plan.md
- [x] T130 [P] Get code review approval (at least 1 reviewer)

---

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Models & Types)
    ↓
Phase 3 (US1: Authentication) ◄── Phase 2
    ↓
Phase 4 (US2: Admin Routing) ◄── Phase 3
Phase 5 (US3: Member Routing) ◄── Phase 3
Phase 6 (US4: Manager Routing) ◄── Phase 3
    ↓
Phase 7 (US5: Error Handling) ◄── Phase 3
    ↓
Phase 8 (Session Management) ◄── Phase 3, 4, 5, 6
    ↓
Phase 9 (Invalid Role & Edge Cases) ◄── Phase 8
    ↓
Phase 10 (Polish & Accessibility) ◄── Phase 9
    ↓
Phase 11 (Integration & Validation) ◄── All phases
```

## Parallel Execution Examples

**User Stories 2, 3, 4 can run in parallel** after Phase 3 completes (all depend on same authentication):
- Role 1/2 admin routing (T036-T052)
- Role 3 member routing (T053-T059)
- Role 4 manager routing (T060-T066)

**All tests within a phase can run in parallel**:
- Unit tests: T027-T030, T045-T048, etc.
- Integration tests: Can run simultaneously on different browsers
- E2E tests: Can run in parallel with Cypress (multi-browser support)

**Setup & Infrastructure (Phase 1)** parallelizable:
- T002, T003, T004, T005, T006 can run concurrently

---

## Success Criteria

✅ **All 130 tasks completed and passing**

- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] All e2e tests passing
- [ ] All FRs (FR-001 through FR-029) implemented and testable
- [ ] All 5 user stories independently testable
- [ ] Measurable outcomes verified (2s redirect, 500ms error feedback, etc.)
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors
- [ ] Code review approved
- [ ] Ready for merge to `develop` branch

---

## Notes

- **Test Optional**: Tests are included as separate tasks; all test tasks are marked independently
- **Parallelization**: Use [P] marker to identify parallelizable tasks
- **User Story Grouping**: Each story (US1-US5) can be independently implemented and deployed
- **MVP Scope**: Recommend implementing US1 + US2/US3/US4 (auth + at least one role routing) as MVP

---

## Sign-Off Checklist

- [ ] Specification reviewed and agreed upon
- [ ] Technical plan approved (infrastructure, dependencies)
- [ ] Design/contracts validated with backend team
- [ ] Development environment set up (Angular CLI, nx, dependencies)
- [ ] Ready to begin Phase 1 setup tasks
