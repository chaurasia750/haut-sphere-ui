# Contract: Module Federation (Shell ↔ Remotes)

**Phase 1 Output** | **Date**: 2026-04-29 | **Related Plan**: [plan.md](plan.md)

## Overview

Module federation defines how shell dynamically loads and initializes remote apps at runtime. This contract specifies the interface each remote must expose for shell to load.

## Remote Exports

### Required Export: AppModule

Each remote must export an Angular NgModule (typically `AppModule`) that shell can load.

**Export Path**: `./AppModule` (or configurable via webpack remoteEntry)

**Example** (Admin Remote):

**File**: `apps/admin/src/app/app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**Export Configuration** (webpack.config.js):

```javascript
plugins: [
  new ModuleFederationPlugin({
    name: 'admin',
    filename: 'remoteEntry.js',
    exposes: {
      './AppModule': 'apps/admin/src/app/app.module.ts',
    },
    shared: {
      '@angular/core': { singleton: true, strictVersion: false },
      '@angular/common': { singleton: true, strictVersion: false },
      '@angular/router': { singleton: true, strictVersion: false },
      'rxjs': { singleton: true, strictVersion: false },
    },
  }),
]
```

## remoteEntry.js Manifest

Each remote serves `remoteEntry.js` at its base route (or versioned URL).

### Example URL
```
http://localhost:4201/remoteEntry.js  (dev)
https://cdn.example.com/admin/1.2.3/remoteEntry.js  (prod)
```

### Expected Content Structure
```javascript
var admin;
(() => {
  // Webpack module federation runtime
  // Exposes modules listed in webpack config
  // Shell uses this to dynamically load admin modules
})();
var admin = /* ... */;
admin.get('./AppModule');  // Shell calls this to get exported module
```

## Shell Loading Mechanism

### Shell Module Federation Config

**File**: `apps/shell/src/app/shell-routing.module.ts` or webpack config

```typescript
// In app-routing.module.ts, remotes are lazy-loaded as follows:

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => 
      import('admin/AppModule').then(m => m.AppModule),
  },
  {
    path: 'member',
    loadChildren: () => 
      import('member/AppModule').then(m => m.AppModule),
  },
  {
    path: 'management',
    loadChildren: () => 
      import('management/AppModule').then(m => m.AppModule),
  },
];
```

### Shell Webpack Config (Module Federation Host)

```javascript
plugins: [
  new ModuleFederationPlugin({
    name: 'shell',
    filename: 'remoteEntry.js',  // Shell also exposes core libs if needed
    remotes: {
      admin: 'admin@http://localhost:4201/remoteEntry.js',
      member: 'member@http://localhost:4202/remoteEntry.js',
      management: 'management@http://localhost:4203/remoteEntry.js',
      // In production:
      // admin: 'admin@https://cdn.example.com/admin/latest/remoteEntry.js',
    },
    shared: {
      '@angular/core': { singleton: true },
      '@angular/common': { singleton: true },
      '@angular/router': { singleton: true },
      'rxjs': { singleton: true },
    },
  }),
]
```

## Remote Routing Requirements

Each remote must define its own routing that shell will lazy-load.

**Example** (Admin `app-routing.module.ts`):

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => 
          import('./modules/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Shared Dependencies

### Versioning

All remotes and shell must share the same major version of:
- `@angular/core`
- `@angular/common`
- `@angular/router`
- `rxjs`

### Singleton Enforcement

Webpack MFE singleton ensures only one instance of shared dependencies is instantiated across all remotes.

```javascript
shared: {
  '@angular/core': { 
    singleton: true,    // Only one version in memory
    strictVersion: true, // Fail fast if version mismatch
  },
}
```

## Error Boundaries

### Module Load Failure

If a remote fails to load (404, syntax error, timeout), shell must catch the error and display user-friendly message.

**Error Handling in Shell**:

```typescript
// shell/src/app/shell-routing.module.ts

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => 
      import('admin/AppModule').then(m => m.AppModule).catch(err => {
        console.error('Failed to load admin:', err);
        // Redirect to error page or show banner
        return null;
      }),
  },
];
```

### Network Timeout

If remoteEntry.js takes >5 seconds to load (configurable), shell should timeout and show error.

## Summary

| Aspect | Requirement |
|--------|-------------|
| **Export Name** | `./AppModule` (NgModule) |
| **Export Location** | Webpack remoteEntry config's `exposes` object |
| **Routing** | Feature modules lazy-loaded with `loadChildren` |
| **Shared Libs** | @angular/core, @angular/common, @angular/router, rxjs (singleton) |
| **Error Handling** | Shell catches load failures; user shown recovery UI |
| **Load Timeout** | <5 seconds to remoteEntry; <3 seconds to render (SC-001) |

---

(End of module federation contract)
