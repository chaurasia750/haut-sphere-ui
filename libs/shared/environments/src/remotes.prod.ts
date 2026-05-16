import { RemoteConfig } from '@shared/types';

export const remoteConfig: RemoteConfig[] = [
  {
    key: 'admin',
    entry: 'https://cdn.company.com/admin/remoteEntry.js',
    exposedModule: './Module',
    route: '/admin',
    displayName: 'Admin Portal',
    preload: true,
    loadTimeout: 10000,
    metadata: {
      version: '1.0.0',
      environment: 'production',
      cache: true
    }
  },
  {
    key: 'member',
    entry: 'https://cdn.company.com/member/remoteEntry.js',
    exposedModule: './Module',
    route: '/member',
    displayName: 'Member Portal',
    preload: true,
    loadTimeout: 10000,
    metadata: {
      version: '1.0.0',
      environment: 'production',
      cache: true
    }
  },
  {
    key: 'management',
    entry: 'https://cdn.company.com/management/remoteEntry.js',
    exposedModule: './Module',
    route: '/management',
    displayName: 'Management Dashboard',
    preload: false,
    loadTimeout: 10000,
    metadata: {
      version: '1.0.0',
      environment: 'production',
      cache: true
    }
  }
];
