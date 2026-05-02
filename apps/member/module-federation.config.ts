const explicitShared: Record<string, any> = {
  '@angular/core': { singleton: true, strictVersion: false },
  '@angular/common': { singleton: true, strictVersion: false },
  '@angular/platform-browser': { singleton: true, strictVersion: false },
  '@angular/router': { singleton: true, strictVersion: false },
  '@angular/forms': { singleton: true, strictVersion: false },
  'rxjs': { singleton: true, strictVersion: false },
  '@shared/types': { singleton: true, strictVersion: false },
  '@shared/auth': { singleton: true, strictVersion: false },
  '@shared/errors': { singleton: true, strictVersion: false },
  '@shared/logging': { singleton: true, strictVersion: false }
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
    if (explicitShared[packageName]) return explicitShared[packageName];
    return defaultSharedConfig;
  },
  // Completely disable DTS generation to avoid 'ws' import in browser
  dts: false
};

export default config;
