# Quickstart: Module Federation Flow – Micro Frontend

**Version**: 1.0 | **Date**: April 29, 2026 | **Audience**: Developers

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Running Applications](#running-applications)
4. [Project Structure](#project-structure)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have:

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **Angular CLI**: v16.x or higher
- **Nx CLI**: v16.x or higher
- **Git**: for version control

### Installation

```bash
# Check Node.js version
node --version  # Should be v18+

# Check npm version
npm --version   # Should be v8+

# Install Angular CLI (if not already installed)
npm install -g @angular/cli

# Install Nx CLI (if not already installed)
npm install -g nx
```

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd haut-spare-ui-final/haut-spare-ui-all
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Angular framework packages
- Nx monorepo tools
- Module Federation support
- Testing libraries
- Build tools

### 3. Verify Installation

```bash
# Check Nx installation
nx --version

# List all projects
nx show projects

# Should display:
# - admin
# - admin-e2e
# - member
# - member-e2e
# - management
# - management-e2e
# - shell
# - shell-e2e
```

---

## Running Applications

### Option 1: Run Shell (Host) with All Remotes

The simplest way to test the complete micro frontend setup:

```bash
# Terminal 1: Start Shell (host) on port 4100
nx serve shell

# Shell will be available at:
# http://localhost:4100
```

The first time Shell starts, it will look for remotes at development URLs. **This will fail** because remotes are not running yet. See Option 2.

### Option 2: Run Everything Locally (Development)

Run all applications in parallel:

```bash
# Terminal 1: Run Admin remote (port 4101)
nx serve admin

# Terminal 2: Run Member remote (port 4102)
nx serve member

# Terminal 3: Run Management remote (port 4103)
nx serve management

# Terminal 4: Run Shell host (port 4100)
nx serve shell
```

Access Shell at: **http://localhost:4100**

In Shell, navigate to:
- **Admin**: Click "Admin" link or go to `/admin`
- **Member**: Click "Member" link or go to `/member`
- **Management**: Click "Management" link or go to `/management`

### Option 3: Run Individual Remote Standalone

Each remote can run independently (useful for isolated development):

```bash
# Run Admin standalone (port 4101)
nx serve admin

# Admin will be available at:
# http://localhost:4101
# All Admin features work without Shell

# You can develop Admin in isolation while Shell team works on host
```

### Option 4: Build for Production

```bash
# Build Shell
nx build shell --configuration production

# Build all remotes
nx build admin --configuration production
nx build member --configuration production
nx build management --configuration production

# Build output in dist/ folder:
# dist/apps/shell/
# dist/apps/admin/
# dist/apps/member/
# dist/apps/management/
```

---

## Project Structure

```
haut-spare-ui-all/
│
├── apps/
│   ├── admin/
│   │   ├── src/
│   │   │   ├── app/                    # Admin feature code
│   │   │   ├── module-federation.config.ts
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── member/
│   │   ├── src/
│   │   │   ├── app/                    # Member feature code
│   │   │   ├── module-federation.config.ts
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── management/
│   │   ├── src/
│   │   │   ├── app/                    # Management feature code
│   │   │   ├── module-federation.config.ts
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   └── shell/
│       ├── src/
│       │   ├── app/
│       │   │   ├── app-routing.module.ts     # Route mapping
│       │   │   ├── remote-loader.service.ts # Load remotes
│       │   │   └── shell.component.ts       # Layout
│       │   ├── environments/
│       │   │   ├── remotes.dev.config.ts    # Dev URLs
│       │   │   └── remotes.prod.config.ts   # Prod URLs
│       │   ├── module-federation.config.ts  # Host config
│       │   └── main.ts
│       ├── project.json
│       └── tsconfig.json
│
├── libs/
│   └── shared/
│       ├── auth/                        # Auth service & guards
│       │   ├── services/auth.service.ts
│       │   └── guards/
│       ├── errors/                      # Error handling
│       │   └── services/error-handler.service.ts
│       ├── types/                       # Shared types
│       │   └── index.ts
│       └── logging/                     # Logging service
│           └── services/logging.service.ts
│
├── specs/
│   └── 002-module-federation-flow/
│       ├── spec.md                      # Feature spec
│       ├── plan.md                      # Implementation plan
│       ├── research.md                  # Clarifications
│       ├── data-model.md                # Data model
│       ├── quickstart.md                # This file
│       └── contracts/
│           ├── shell-contract.md        # Shell API
│           └── remote-contract.md       # Remote requirements
│
├── package.json
├── nx.json
├── tsconfig.base.json
└── README.md
```

---

## Common Tasks

### Task 1: Develop a New Feature in Admin Remote

```bash
# 1. Start Admin standalone
nx serve admin

# 2. Open http://localhost:4101 in browser

# 3. Edit files in admin/src/app/
#    Changes auto-reload

# 4. Run tests while developing
nx test admin --watch

# 5. When ready, test with Shell:
#    Terminal 1: nx serve admin
#    Terminal 2: nx serve member
#    Terminal 3: nx serve management
#    Terminal 4: nx serve shell
#    Navigate to /admin in Shell
```

### Task 2: Add New Shared Service

```bash
# 1. Create service in libs/shared/
nx generate @nx/angular:service shared/new-service \
  --path=libs/shared/services/new.service

# 2. Export from libs/shared/index.ts
# 3. Update module-federation.config.ts if needed
# 4. Import in remotes:
#    import { NewService } from '@libs/shared';
```

### Task 3: Add New Remote Application

```bash
# 1. Generate new app (e.g., reports)
nx generate @nx/angular:app reports \
  --style=scss \
  --routing=true

# 2. Add module-federation.config.ts
#    (copy from existing remote and update name)

# 3. Configure in Shell's remotes.dev.config.ts:
#    {
#      key: 'reports',
#      entry: 'http://localhost:4104/remoteEntry.js',
#      route: '/reports',
#      ...
#    }

# 4. Update Shell's routing to include new remote

# 5. Test: nx serve reports

# 6. Add to remotes.prod.config.ts for production
```

### Task 4: Run Unit Tests

```bash
# Test single app
nx test admin

# Test with coverage
nx test admin --coverage

# Watch mode (reruns on file change)
nx test admin --watch

# Test all projects
nx test
```

### Task 5: Run E2E Tests

```bash
# Run E2E tests for Shell
nx e2e shell-e2e

# Run with headed browser (see what's happening)
nx e2e shell-e2e --headed

# Run specific test file
nx e2e shell-e2e --spec=src/example.spec.ts
```

### Task 6: Lint Code

```bash
# Lint single app
nx lint admin

# Lint all projects
nx lint

# Fix linting issues automatically
nx lint admin --fix
```

### Task 7: Build for Deployment

```bash
# Build Shell for production
nx build shell --configuration=production

# Build all remotes for production
nx build admin --configuration=production
nx build member --configuration=production
nx build management --configuration=production

# Output is in dist/ directory
# Upload these to your CDN/hosting
```

---

## Environment-Specific Configuration

### Development (localhost)

**File**: `libs/shared/environments/src/remotes.dev.ts` (shared across all apps)

```typescript
export const remotes = {
  admin: 'http://localhost:4101/remoteEntry.js',
  member: 'http://localhost:4102/remoteEntry.js',
  management: 'http://localhost:4103/remoteEntry.js'
};
```

### Staging

**File**: `libs/shared/environments/src/remotes.staging.ts`

```typescript
export const remotes = {
  admin: 'https://staging-cdn.company.com/admin/remoteEntry.js',
  member: 'https://staging-cdn.company.com/member/remoteEntry.js',
  management: 'https://staging-cdn.company.com/management/remoteEntry.js'
};
```

### Production

**File**: `libs/shared/environments/src/remotes.prod.ts`

```typescript
export const remotes = {
  admin: 'https://cdn.company.com/admin/remoteEntry.js',
  member: 'https://cdn.company.com/member/remoteEntry.js',
  management: 'https://cdn.company.com/management/remoteEntry.js'
};
```

---

## Troubleshooting

### Issue 1: "Cannot find module" error when running Shell

**Cause**: Remotes not running on expected ports

**Solution**:
```bash
# Start all services in separate terminals:
Terminal 1: nx serve admin
Terminal 2: nx serve member
Terminal 3: nx serve management
Terminal 4: nx serve shell

# Shell waits for remotes on startup, then loads them
```

### Issue 2: "ERR_FAILED_IMPORT" in console

**Cause**: Remote entry point URL is incorrect or remote is not serving

**Solution**:
```bash
# 1. Check remotes.dev.config.ts has correct URLs
# 2. Verify remotes are running:
#    curl http://localhost:4101/remoteEntry.js  # Should return JS

# 3. Clear browser cache:
#    Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Safari)
#    Then reload page
```

### Issue 3: Shared library changes not reflecting

**Cause**: Module Federation cache

**Solution**:
```bash
# Stop all servers
# Clear caches:
rm -rf dist/
rm -rf node_modules/.cache/

# Reinstall and rebuild:
npm install
nx serve shell

# Restart all services
```

### Issue 4: Remote works standalone but fails in Shell

**Cause**: Module Federation configuration mismatch

**Solution**:
```bash
# 1. Check remote's module-federation.config.ts
# 2. Verify shared dependencies match Shell's config
# 3. Run: nx build <remote> --configuration=development
# 4. Check build output in dist/

# If still failing, enable debug mode:
# Add to browser console:
localStorage.setItem('webpack5.debug', 'true');
```

### Issue 5: "Port already in use" error

**Cause**: Port is occupied by another process

**Solution**:
```bash
# Windows
netstat -ano | findstr :4100
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4100
kill -9 <PID>

# Or use different port:
nx serve shell --port 5100
```

### Issue 6: Changes not auto-reloading

**Cause**: File watcher issue

**Solution**:
```bash
# Increase file watchers (Mac/Linux):
echo fs.inotify.max_user_watches=524288 | \
  sudo tee -a /etc/sysctl.conf && \
  sudo sysctl -p

# Restart dev server:
nx serve admin

# Windows: Usually not an issue, just restart
```

---

## Performance Tips

1. **Run remotes in separate terminals**: Better performance isolation
2. **Use nx affected commands**: Run only changed projects
   ```bash
   nx affected:test          # Test only affected projects
   nx affected:build         # Build only affected projects
   ```

3. **Monitor bundle size**: 
   ```bash
   nx build shell --stats-json
   # Analyze with: webpack-bundle-analyzer
   ```

4. **Use production build locally**: 
   ```bash
   ng build shell --configuration=production
   npx http-server dist/apps/shell/
   ```

---

## Next Steps

- Read [spec.md](./spec.md) for full feature specification
- Review [data-model.md](./data-model.md) for entity definitions
- Check [contracts/shell-contract.md](./contracts/shell-contract.md) for Shell API
- Review [contracts/remote-contract.md](./contracts/remote-contract.md) for remote requirements
- Read [plan.md](./plan.md) for implementation details

---

## Support

- **Questions**: Open GitHub issue with tag `mfe` (micro-frontend)
- **Bug Reports**: Include error message, steps to reproduce, environment details
- **Feature Requests**: Check if already in specification

---

## Document References

- **Feature Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Research & Decisions**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Shell Contract**: [contracts/shell-contract.md](./contracts/shell-contract.md)
- **Remote Contract**: [contracts/remote-contract.md](./contracts/remote-contract.md)

