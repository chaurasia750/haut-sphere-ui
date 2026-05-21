
const explicitShared: Record<string, any> = {
  '@angular/core': { singleton: true, strictVersion: false, eager: true },
  '@angular/core/primitives/di': { singleton: true, strictVersion: false, eager: true },
  '@angular/core/primitives/signals': { singleton: true, strictVersion: false, eager: true },
  '@angular/common': { singleton: true, strictVersion: false, eager: true },
  '@angular/common/http': { singleton: true, strictVersion: false, eager: true },
  '@angular/platform-browser': { singleton: true, strictVersion: false, eager: true },
  '@angular/router': { singleton: true, strictVersion: false, eager: true },
  '@angular/forms': { singleton: true, strictVersion: false, eager: true },
  'rxjs': { singleton: true, strictVersion: false, eager: true },
  'rxjs/operators': { singleton: true, strictVersion: false, eager: true },
  '@shared/i18n': { singleton: true, strictVersion: false },
  '@shared/types': { singleton: true, strictVersion: false, eager: true },
  '@shared/auth': { singleton: true, strictVersion: false, eager: true },
  '@shared/errors': { singleton: true, strictVersion: false, eager: true },
  '@shared/logging': { singleton: true, strictVersion: false, eager: true }
};

const config = {
  name: 'admin',
  filename: 'remoteEntry.mjs',
  exposes: {
    // Expose a minimal component-only remote entry so hosts import a small
    // standalone root instead of the full AppModule/AppComponent. This
    // avoids heavy injected services (Title, Router root providers) being
    // executed when the shell creates the remote component.
    './Module': 'apps/admin/src/app/remote-entry.ts'
  },
  shared: (packageName: string, defaultSharedConfig: any) => {
    // Exclude platform-browser-dynamic — it brings in the JIT compiler
    // which causes "JIT compiler not available" errors in the AOT shell
    if (packageName === '@angular/platform-browser-dynamic') return false;
    if (packageName === '@shared') return false;
    if (explicitShared[packageName]) return explicitShared[packageName];

    // Share all @shared/* subpaths as singletons so shared library components
    // (side-panel, date-picker, date-range-picker) don't get duplicated
    // across shell and remote, causing NG0912 component ID collisions.
    if (packageName.startsWith('@shared/')) {
      return { singleton: true, strictVersion: false, eager: true };
    }

    // Share all @angular/material/* and @angular/cdk/* subpaths as singletons
    // to prevent NG0912 component ID collision errors when the remote loads
    // its own copy on top of the shell's copy of Material/CDK components.
    if (
      packageName.startsWith('@angular/material') ||
      packageName.startsWith('@angular/cdk')
    ) {
      return { singleton: true, strictVersion: false, eager: true };
    }

    return defaultSharedConfig;
  },
  // Completely disable DTS generation to avoid 'ws' import in browser
  dts: false
};

export default config;
