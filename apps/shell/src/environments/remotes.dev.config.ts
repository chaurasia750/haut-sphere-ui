import { RemoteConfig } from '@shared';

/**
 * Development Environment Remote Configuration
 * All remotes run locally on different ports
 */
export const remoteConfig: RemoteConfig[] = [
  {
    key: 'admin',
    entry: 'http://localhost:4101/remoteEntry.mjs',
    exposedModule: './Module',
    route: '/admin',
    displayName: 'Admin Portal',
    preload: false,
    loadTimeout: 5000,
    metadata: {
      version: '1.0.0',
      description: 'Administration management interface'
    }
  },
  {
    key: 'member',
    entry: 'http://localhost:4102/remoteEntry.mjs',
    exposedModule: './Module',
    route: '/member',
    displayName: 'Member Portal',
    preload: false,
    loadTimeout: 5000,
    metadata: {
      version: '1.0.0',
      description: 'Member dashboard and profile'
    }
  },
  {
    key: 'management',
    entry: 'http://localhost:4103/remoteEntry.mjs',
    exposedModule: './Module',
    route: '/management',
    displayName: 'Management Dashboard',
    preload: false,
    loadTimeout: 5000,
    metadata: {
      version: '1.0.0',
      description: 'Management and analytics'
    }
  }
];
