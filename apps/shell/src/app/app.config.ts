import { ApplicationConfig } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RemoteLoaderService } from './services/remote-loader.service';
import { RemoteContainerComponent } from './components/remote-container.component';
import { remoteConfig } from '../environments/remotes.dev.config';
import { LoginComponent } from './features/login/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { RoleId } from '@libs/shared/auth';

export const appRoutes: Route[] = [
  // Public login route
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  
  // Dashboard
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  
  // Module federation routes (protected)
  {
    path: 'admin',
    component: RemoteContainerComponent,
    canActivate: [authGuard],
    data: {
      remoteConfig: remoteConfig.find((c: any) => c.key === 'admin'),
      roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN]
    }
  },
  {
    path: 'member',
    component: RemoteContainerComponent,
    canActivate: [authGuard],
    data: {
      remoteConfig: remoteConfig.find((c: any) => c.key === 'member'),
      roles: [RoleId.MEMBER]
    }
  },
  {
    path: 'management',
    component: RemoteContainerComponent,
    canActivate: [authGuard],
    data: {
      remoteConfig: remoteConfig.find((c: any) => c.key === 'management'),
      roles: [RoleId.MANAGER]
    }
  },
  
  // Default redirect to login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/login' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    RemoteLoaderService,
  ],
};
