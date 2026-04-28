# Quickstart: Microfrontend Style (NX + Angular Enterprise)

**Phase 1 Output** | **Date**: 2026-04-29 | **Related Plan**: [plan.md](plan.md)

## Prerequisites

- **Node.js**: 16.x or 18.x
- **npm**: 8.x or 9.x (or pnpm 7.x+)
- **Git**: 2.30+
- **Angular CLI**: 16+ (optional; use `nx` CLI instead)
- **NX CLI**: Latest stable (`npm install -g nx`)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/[org]/[repo].git
cd haut-spare-ui-all
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Verify NX Setup

```bash
npx nx list
# Outputs installed NX plugins
```

---

## Local Development

### Running Shell (Host)

```bash
npx nx serve shell --open
```

- Opens browser at `http://localhost:4200`
- Shell loads without remotes (if remotes not running)
- Navigate to `/admin`, `/member`, `/management` (may show error placeholders if remotes not running)

### Running a Remote App (e.g., Admin)

In separate terminal:

```bash
npx nx serve admin --open
```

- Opens browser at `http://localhost:4201` (or next available port)
- Admin app runs standalone with local development
- Can test admin independently

### Running All Apps Together (Local MFE Setup)

Terminal 1 - Shell:
```bash
npx nx serve shell --open
```

Terminal 2 - Admin remote:
```bash
npx nx serve admin
```

Terminal 3 - Member remote:
```bash
npx nx serve member
```

Terminal 4 - Management remote:
```bash
npx nx serve management
```

Then navigate in shell browser to `/admin`, `/member`, `/management`. Shell should load remotes from their local dev servers.

### Testing

**Unit tests** (Jasmine/Karma):
```bash
npx nx test admin
npx nx test member
npx nx test management
npx nx test shell
```

**E2E tests** (Cypress):
```bash
npx nx e2e admin-e2e --open
npx nx e2e member-e2e --open
```

### Linting

```bash
npx nx lint admin
npx nx lint member
npx nx lint management
npx nx lint shell
```

---

## Build for Production

### Build Shell

```bash
npx nx build shell --prod
```

Output: `dist/apps/shell/`

### Build a Remote

```bash
npx nx build admin --prod
npx nx build member --prod
npx nx build management --prod
```

Output: `dist/apps/[app-name]/`

---

## File Structure Overview

```
apps/
├── shell/               # Host application
│   └── src/app/         # Shell layout, routing, core services
├── admin/               # Remote app 1
│   └── src/app/modules/ # Feature modules inside admin
├── member/              # Remote app 2
│   └── src/app/modules/
└── management/          # Remote app 3
    └── src/app/modules/

libs/                    # Shared libraries (minimal use)
├── shared/              # Models, types, helpers
├── ui/                  # Reusable UI components
└── auth/                # (optional) Auth service

specs/001-microfrontend-style/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Technical research decisions
├── data-model.md        # Domain entities (this helps!)
├── quickstart.md        # This file
└── contracts/           # API contracts

.github/workflows/
├── build-shell.yml      # CI for shell
├── build-admin.yml      # CI for admin
├── build-member.yml     # CI for member
└── build-management.yml # CI for management
```

---

## Creating a New Feature Module

### Example: Add "Reports" Feature to Admin

```bash
# Generate feature module (using NX schematics)
npx nx generate @nx/angular:module \
  --path apps/admin/src/app/modules \
  --name reports
```

This creates:
```
apps/admin/src/app/modules/reports/
├── reports.module.ts
├── reports-routing.module.ts
└── README.md
```

### Add Components to Feature

```bash
npx nx generate @nx/angular:component \
  --path apps/admin/src/app/modules/reports/pages \
  --name reports-list
```

Creates:
```
apps/admin/src/app/modules/reports/pages/reports-list/
├── reports-list.component.ts
├── reports-list.component.html
├── reports-list.component.scss
└── reports-list.component.spec.ts
```

### Register Feature in Feature Module

Edit `apps/admin/src/app/modules/reports/reports.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsListComponent } from './pages/reports-list/reports-list.component';

@NgModule({
  imports: [CommonModule, ReportsRoutingModule],
  declarations: [ReportsListComponent],
})
export class ReportsModule {}
```

---

## Authentication Flow

### 1. Shell Provides AuthService

**Location**: `apps/shell/src/app/core/auth.service.ts`

```typescript
export class AuthService {
  getToken(): Observable<string> { /* ... */ }
  getUser(): Observable<User> { /* ... */ }
  login(credentials): Observable<User> { /* ... */ }
  logout(): void { /* ... */ }
}
```

### 2. Remote Injects AuthService

In any component or service within admin/member/management:

```typescript
import { AuthService } from '@app/auth'; // shell's auth service

@Component({ /* ... */ })
export class MyComponent {
  user$ = this.auth.getUser();
  
  constructor(private auth: AuthService) {}
}
```

### 3. HTTP Interceptor Adds Auth Header

Shell's HTTP interceptor automatically adds:
```
Authorization: Bearer [token]
```

to all outgoing API requests.

---

## Styling with Tailwind + SCSS

### Tailwind Config

Located at workspace root: `tailwind.config.js`

Scans all app and lib source files. All remotes use the same config.

### Using Tailwind in Components

```html
<!-- Button with Tailwind utilities -->
<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click Me
</button>
```

### Component-Level SCSS

For styles not covered by Tailwind, create component `.scss`:

```scss
// apps/admin/src/app/modules/users/components/user-card/user-card.component.scss

.user-card {
  border: 1px solid var(--color-border);
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
```

Include in component:

```typescript
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {}
```

---

## Debugging Remote Load Issues

### Remote Fails to Load

Check browser console for errors:

1. **404 remoteEntry.js**: Ensure remote is running (`nx serve admin`) or deployed to correct URL
2. **Webpack version mismatch**: Verify shell and remotes use same Webpack version (check `package.json`)
3. **Shared dependency conflict**: Check shared config in `webpack.config.js` for all remotes
4. **CORS errors**: Ensure development servers allow cross-origin requests (usually auto-configured)

### View Remote Config

```bash
# Inspect admin remote's NX project config
npx nx show project admin --web
```

### Rebuild Cache

If something doesn't update:

```bash
npx nx reset
npm install
npx nx build [app]
```

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `nx serve shell` | Run shell in dev mode |
| `nx serve admin` | Run admin remote in dev mode |
| `nx test admin` | Run unit tests for admin |
| `nx lint admin` | Lint admin code |
| `nx build admin --prod` | Build admin for production |
| `nx dep-graph` | Visualize dependency graph |
| `nx list` | Show installed NX plugins |
| `nx reset` | Clear NX cache |

---

## Deployment

### Standalone Deployment (Example: Admin)

1. Build admin: `nx build admin --prod`
2. Output in `dist/apps/admin/`
3. Deploy to CDN or static hosting (Vercel, Netlify, AWS S3, etc.)
4. Update shell's remote config to point to deployed admin remoteEntry URL
5. Shell reloads and loads admin from production URL

### Shell Deployment

1. Build shell: `nx build shell --prod`
2. Deploy to main hosting (same as above)
3. Shell serves at `https://app.example.com`

### CI/CD Workflows

See `.github/workflows/` for independent build pipelines per app.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module 'admin'" | Ensure admin app is built and remoteEntry.js is accessible |
| "Unexpected token <" in remoteEntry | Check CORS headers; may be serving HTML instead of JS |
| "Module not available for sharing" | Verify shared config in webpack.config.js |
| "App works alone but breaks when loading from shell" | Check that all dependencies (Angular, RxJS) are in shared config |

---

## Next Steps

1. **Create feature module** in a remote (see "Creating a New Feature Module" above)
2. **Add authentication** to a component (inject AuthService)
3. **Add styling** (use Tailwind utilities + component SCSS)
4. **Run tests** to verify changes
5. **Build and deploy** to staging environment

---

## Additional Resources

- [NX Angular Module Federation Guide](https://nx.dev/recipes/angular/setup-module-federation)
- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Angular Architecture Guide](https://angular.io/guide/architecture)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

(End of quickstart)
