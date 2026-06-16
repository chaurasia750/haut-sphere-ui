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
  name: 'member',
  filename: 'remoteEntry.mjs',
  exposes: {
    './Module': 'apps/member/src/app/app.module.ts'
  },
  shared: (packageName: string, defaultSharedConfig: any) => {
    // Exclude platform-browser-dynamic — it brings in the JIT compiler
    // which causes "JIT compiler not available" errors in the AOT shell
    if (packageName === '@angular/platform-browser-dynamic') return false;
    if (packageName === '@shared') return false;
    if (explicitShared[packageName]) return explicitShared[packageName];

    // Share all @shared/* subpaths as singletons so shared library components
    // don't get duplicated across shell and remote, causing NG0912 component ID collisions.
    if (packageName.startsWith('@shared/')) {
      return { singleton: true, strictVersion: false, eager: true };
    }

    return defaultSharedConfig;
  },
  // Completely disable DTS generation to avoid 'ws' import in browser
  dts: false
};

export default config;
