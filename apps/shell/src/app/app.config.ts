import { ApplicationConfig } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RemoteLoaderService } from './services/remote-loader.service';
import { RemoteContainerComponent } from './components/remote-container.component';
import { remoteConfig } from '../environments/remotes.dev.config';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    RemoteLoaderService,
  ],
};
