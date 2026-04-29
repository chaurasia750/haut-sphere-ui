import { Route } from '@angular/router';
import { RemoteContainerComponent } from './components/remote-container.component';
import { remoteConfig } from '../environments/remotes.dev.config';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    component: RemoteContainerComponent,
    data: { remoteConfig: remoteConfig.find((c: any) => c.key === 'admin') }
  },
  {
    path: 'member',
    component: RemoteContainerComponent,
    data: { remoteConfig: remoteConfig.find((c: any) => c.key === 'member') }
  },
  {
    path: 'management',
    component: RemoteContainerComponent,
    data: { remoteConfig: remoteConfig.find((c: any) => c.key === 'management') }
  },
  { path: '**', redirectTo: '/dashboard' }
];
