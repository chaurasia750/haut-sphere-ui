import { RemoteConfig } from '@shared/types';

/**
 * Staging Environment Remote Configuration
 * Remotes served from staging CDN
 */
export const remoteConfig: RemoteConfig[] = [
  {
    key: 'admin',
    entry: 'https://staging-cdn.company.com/admin/remoteEntry.js',
    exposedModule: './Module',
    route: '/admin',
    displayName: 'Admin Portal',
    preload: false,
    loadTimeout: 8000,
    metadata: {
      version: '1.0.0',
      environment: 'staging'
    }
  },
  {
    key: 'member',
    entry: 'https://aronemember.bankatm.in/member/remoteEntry.js',
    exposedModule: './Module',
    route: '/member',
    displayName: 'Member Portal',
    preload: false,
    loadTimeout: 8000,
    metadata: {
      version: '1.0.0',
      environment: 'staging'
    }
  },
  {
    key: 'management',
    entry: 'https://staging-cdn.company.com/management/remoteEntry.js',
    exposedModule: './Module',
    route: '/management',
    displayName: 'Management Dashboard',
    preload: false,
    loadTimeout: 8000,
    metadata: {
      version: '1.0.0',
      environment: 'staging'
    }
  }
];
