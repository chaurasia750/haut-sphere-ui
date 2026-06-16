# Project: Haut Spare UI (Member + Admin)

## Progress
### Done
- Member routing paths renamed leads-* → customers-*
- Shared components use `appPrefix` conditional logic for "Customers" vs "Leads"
- "All Users" dropdown hidden on member dashboard
- Add Customer button navigates correctly in both apps
- Horizontal scroll fixed in member layout
- Lead add form validation timing bug fixed (appPrefix race)
- Lead add navigation after save fixed
- Assign user and checkboxes hidden in member leads list
- Lead details null protection (createdBy, assignedUser nullable)
- Lead For → Plan For; [object Object] fixed
- Member dashboard: top card removed; Distributor → Associate with profile API
- SponsorMembers: uses MembersService with response unwrapping fallback

### In Progress
- SponsorMembers data display issue (intermittent)

## Known Issues
1. **Shell vs remote HttpClient**: Member app provides its own `HttpClient` via `provideHttpClient(withInterceptorsFromDi())` in AppModule. Shell's `HttpResponseInterceptor` may not always be available to remote app HTTP calls.

### SponsorMembersComponent
- Uses `MembersService.getMembers()` (same as member list page)
- Response fallback: `res?.data ?? res` then `unwrapped?.items ?? []`
- Client-side pagination: `itemsPerPage = 5`, same pattern as sponsor-list, bank-details, downline-list
- Date pipe: `member.joiningDate | date:'dd/MM/yyyy'`
- Uses `ButtonComponent` (shared UI) for prev/next
- Added `ChangeDetectorRef.markForCheck()` for CD safety

## Routes
- Member: /member/customers-dashboard, /member/customers-list, /member/customers-add, /member/customers-detail/:id, /member/customers-closing/:id
- Admin: /admin/leads/dashboard, /admin/leads/list, /admin/leads/add, /admin/leads/detail/:id, /admin/leads/closing/:id

## Key Libraries
- `libs/shared/leads/` - Shared lead components (header, list, detail, add)
- `libs/shared/members/` - Shared member components and MembersService
- `apps/member/` - Member remote app
- `apps/admin/` - Admin app
- `apps/shell/` - Shell with interceptors
