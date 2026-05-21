import { ModuleFederationConfig } from '@nx/angular/module-federation';

const explicitShared: Record<string, any> = {
  '@angular/core': { singleton: true, strictVersion: true, eager: true },
  '@angular/common': { singleton: true, strictVersion: true, eager: true },
  '@angular/platform-browser': { singleton: true, strictVersion: true, eager: true },
  '@angular/platform-browser-dynamic': { singleton: true, strictVersion: true, eager: true },
  '@angular/router': { singleton: true, strictVersion: true, eager: true },
  '@angular/forms': { singleton: true, strictVersion: true, eager: true },
  'rxjs': { singleton: true, strictVersion: true, eager: true },
  '@shared': { singleton: true, strictVersion: true, eager: true },
  '@shared/types': { singleton: true, strictVersion: true, eager: true },
  '@shared/auth': { singleton: true, strictVersion: true, eager: true },
  '@shared/errors': { singleton: true, strictVersion: true, eager: true },
  '@shared/logging': { singleton: true, strictVersion: true, eager: true },
};

const config: ModuleFederationConfig = {
  name: 'shell',
  filename: 'remoteEntry.js',
  exposes: {},
  shared: (packageName: string, defaultSharedConfig: any) => {
    if (explicitShared[packageName]) return explicitShared[packageName];

    // Share all @angular/material/* and @angular/cdk/* subpaths as singletons
    // to prevent NG0912 component ID collision errors when the remote loads
    // its own copy on top of the shell's copy of Material/CDK components.
    if (
      packageName.startsWith('@angular/material') ||
      packageName.startsWith('@angular/cdk')
    ) {
      return { singleton: true, strictVersion: true, eager: true };
    }

    return defaultSharedConfig;
  },
};

export default config;
