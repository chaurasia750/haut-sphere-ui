import { ModuleFederationConfig } from '@nx/angular/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  filename: 'remoteEntry.js',
  exposes: {
    // Shell doesn't expose any modules to remotes
  },
  shared: {
    // Angular core packages - singleton to avoid duplication
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/platform-browser': { singleton: true, strictVersion: true },
    '@angular/platform-browser-dynamic': { singleton: true, strictVersion: true },
    '@angular/router': { singleton: true, strictVersion: true },
    '@angular/forms': { singleton: true, strictVersion: true },
    
    // RxJS - singleton to share observable instances
    'rxjs': { singleton: true, strictVersion: true },
    
    // Shared libraries - singleton to enforce single instance
    '@shared/types': { singleton: true, strictVersion: true },
    '@shared/auth': { singleton: true, strictVersion: true },
    '@shared/errors': { singleton: true, strictVersion: true },
    '@shared/logging': { singleton: true, strictVersion: true }
  }
};

export default config;
