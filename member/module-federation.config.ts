import { ModuleFederationConfig } from '@nx/angular/module-federation';

const config: ModuleFederationConfig = {
  name: 'member',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': {
      import: 'member/src/app/app.module.ts',
      shareScope: 'default'
    }
  },
  shared: {
    // Angular core packages - singleton
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/platform-browser': { singleton: true, strictVersion: true },
    '@angular/platform-browser-dynamic': { singleton: true, strictVersion: true },
    '@angular/router': { singleton: true, strictVersion: true },
    '@angular/forms': { singleton: true, strictVersion: true },
    
    // RxJS - singleton
    'rxjs': { singleton: true, strictVersion: true },
    
    // Shared libraries
    '@shared/types': { singleton: true, strictVersion: true },
    '@shared/auth': { singleton: true, strictVersion: true },
    '@shared/errors': { singleton: true, strictVersion: true },
    '@shared/logging': { singleton: true, strictVersion: true }
  }
};

export default config;
