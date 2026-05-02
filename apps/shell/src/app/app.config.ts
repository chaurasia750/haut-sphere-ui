import { ApplicationConfig } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RemoteLoaderService } from './services/remote-loader.service';
import { RemoteContainerComponent } from './components/remote-container.component';
import { RemoteUnavailableComponent } from './components/remote-unavailable.component';
import { remoteConfig } from '../environments/remotes.dev.config';
import { LoginComponent } from './features/login/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { RoleId } from '@libs/shared/auth';
import { HttpAuthInterceptor } from './core/http-interceptor';

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
    loadChildren: async () => {
      const memberEntry = 'http://localhost:4102/remoteEntry.mjs';
      try {
        const [
          ngCore,
          ngCommon,
          ngCommonHttp,
          ngRouter,
          ngForms,
          ngPlatformBrowser,
          rxjs,
        ] = await Promise.all([
          import('@angular/core'),
          import('@angular/common'),
          import('@angular/common/http'),
          import('@angular/router'),
          import('@angular/forms'),
          import('@angular/platform-browser'),
          import('rxjs'),
        ]);

        const w = window as any;
        w.__webpack_share_scopes__ = w.__webpack_share_scopes__ || { default: {} };
        const shareScope = w.__webpack_share_scopes__.default;

        const registerShare = (pkg: string, value: any, version: string) => {
          const versions = shareScope[pkg] || (shareScope[pkg] = {});
          versions[version] = {
            get: () => () => value,
            from: 'shell',
            eager: true,
            loaded: 1,
          };
        };

        registerShare('@angular/core', ngCore, '21.2.10');
        registerShare('@angular/common', ngCommon, '21.2.10');
        registerShare('@angular/common/http', ngCommonHttp, '21.2.10');
        registerShare('@angular/router', ngRouter, '21.2.10');
        registerShare('@angular/forms', ngForms, '21.2.10');
        registerShare('@angular/platform-browser', ngPlatformBrowser, '21.2.10');
        registerShare('rxjs', rxjs, '7.8.2');

        if (typeof w.__webpack_init_sharing__ !== 'function') {
          w.__webpack_init_sharing__ = async () => undefined;
        }

        const container: any = await import(/* @vite-ignore */ memberEntry);
        if (typeof w.__webpack_init_sharing__ === 'function') {
          await w.__webpack_init_sharing__('default');
        }
        try {
          await container.init(shareScope);
        } catch {}

        const factory = await container.get('./Module');
        const mod = factory();

        return mod.AppModule;
      } catch (error: any) {
        console.error('[shell] Member remote load FAILED:', error?.message || error);
        console.error('[shell] Full error:', error);
        return [
          {
            path: '',
            component: RemoteUnavailableComponent,
            data: {
              title: 'Member App Unavailable',
              message: 'Member remote could not be loaded from http://localhost:4102/remoteEntry.mjs.',
            },
          },
        ];
      }
    },
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
  
  // Default redirect to local dashboard so shell remains usable if remotes are down
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // All unmatched routes → local dashboard
  { path: '**', redirectTo: '/dashboard' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
    RemoteLoaderService,
  ],
};
