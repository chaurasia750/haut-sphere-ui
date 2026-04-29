import { ModuleFederationConfig } from '@nx/module-federation/angular';

const explicitShared: Record<string, any> = {
  '@angular/core': { singleton: true, strictVersion: true },
  '@angular/common': { singleton: true, strictVersion: true },
  '@angular/platform-browser': { singleton: true, strictVersion: true },
  '@angular/platform-browser-dynamic': { singleton: true, strictVersion: true },
  '@angular/router': { singleton: true, strictVersion: true },
  '@angular/forms': { singleton: true, strictVersion: true },
  'rxjs': { singleton: true, strictVersion: true },
  '@shared/types': { singleton: true, strictVersion: true },
  '@shared/auth': { singleton: true, strictVersion: true },
  '@shared/errors': { singleton: true, strictVersion: true },
  '@shared/logging': { singleton: true, strictVersion: true }
};

const config: ModuleFederationConfig = {
  name: 'admin',
  filename: 'remoteEntry.mjs',
  exposes: {
    './Module': {
      import: './src/app/app.module.ts'
    }
  },
  // Provide a function so @nx/module-federation can filter/modify shared deps
  shared: (packageName: string, defaultSharedConfig: any) => {
    if (explicitShared[packageName]) return explicitShared[packageName];
    return defaultSharedConfig;
  },
  // Disable DTS plugin to avoid TYPE-001 errors during serve
  dts: false
};

export default config;
