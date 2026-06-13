import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { RemoteLoaderService } from './services/remote-loader.service';
import { RemoteUnavailableComponent } from './components/remote-unavailable.component';
import { remoteConfig } from '@shared/environments/remotes.dev';
import { LoginComponent } from './features/login/pages/login/login.component';
import { SignupComponent } from './features/signup/pages/signup/signup.component';
import { UnauthorizedComponent } from './features/error/pages/unauthorized/unauthorized.component';
import { authGuard } from './core/guards/auth.guard';
import { AUTH_COOKIE_CONFIG, AuthInterceptor, RoleId, provideAuthInitializer } from '@libs/shared/auth';
import { AUTH_API_BASE_URL } from '@libs/shared/auth/lib/auth-api.service';
import { HttpCredentialsInterceptor } from './core/http-credentials.interceptor';
import { HttpErrorInterceptor } from './core/http-error.interceptor';
import { HttpResponseInterceptor } from './core/http-response.interceptor';
import { createSharedTranslateLoader, SharedTranslationService } from '@shared/i18n';
import { ADDRESS_LOOKUP_API_BASE_URL } from '@shared/ui/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { apiConfig } from '@shared/environments/api.dev';

export const appRoutes: Route[] = [
  // Public login route
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Signup' }
  },
  {
    path: 'error/unauthorized',
    component: UnauthorizedComponent,
    data: { title: 'Access Denied' }
  },
  
  // Module federation routes (protected)
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN] },
    loadChildren: async () => {
      const adminConfig = remoteConfig.find((c: any) => c.key === 'admin');
      const adminEntry = adminConfig?.entry ?? 'http://localhost:4101/remoteEntry.mjs';
      if (!adminConfig) return [{ path: '', redirectTo: '/member', pathMatch: 'full' }];
      try {
        const [
          ngCore, ngCorePrimitivesDi, ngCorePrimitivesSignals,
          ngCommon, ngCommonHttp, ngRouter, ngForms, ngPlatformBrowser,
          rxjs, rxjsOperators, sharedI18n,
        ] = await Promise.all([
          import('@angular/core'),
          import('@angular/core/primitives/di'),
          import('@angular/core/primitives/signals'),
          import('@angular/common'),
          import('@angular/common/http'),
          import('@angular/router'),
          import('@angular/forms'),
          import('@angular/platform-browser'),
          import('rxjs'),
          import('rxjs/operators'),
          import('@shared/i18n'),
        ]);

        const w = window as any;
        w.__webpack_share_scopes__ = w.__webpack_share_scopes__ || { default: {} };
        const shareScope = w.__webpack_share_scopes__.default;

        const registerShare = (pkg: string, value: any, version: string) => {
          const versions = shareScope[pkg] || (shareScope[pkg] = {});
          versions[version] = { get: () => () => value, from: 'shell', eager: true, loaded: 1 };
        };

        registerShare('@angular/core', ngCore, '21.2.10');
        registerShare('@angular/core/primitives/di', ngCorePrimitivesDi, '21.2.10');
        registerShare('@angular/core/primitives/signals', ngCorePrimitivesSignals, '21.2.10');
        registerShare('@angular/common', ngCommon, '21.2.10');
        registerShare('@angular/common/http', ngCommonHttp, '21.2.10');
        registerShare('@angular/router', ngRouter, '21.2.10');
        registerShare('@angular/forms', ngForms, '21.2.10');
        registerShare('@angular/platform-browser', ngPlatformBrowser, '21.2.10');
        registerShare('rxjs', rxjs, '7.8.2');
        registerShare('rxjs/operators', rxjsOperators, '7.8.2');
        registerShare('@shared/i18n', sharedI18n, '0.0.0');

        if (typeof w.__webpack_init_sharing__ !== 'function') {
          w.__webpack_init_sharing__ = async () => undefined;
        }

        const container: any = await import(/* @vite-ignore */ adminEntry);
        if (typeof w.__webpack_init_sharing__ === 'function') {
          await w.__webpack_init_sharing__('default');
        }
        try { await container.init(shareScope); } catch {}

        const factory = await container.get('./Module');
        const mod = factory();
        return mod.AppModule;
      } catch (error: any) {
        console.error('[shell] Admin remote load FAILED:', error?.message || error);
        return [{
          path: '',
          component: RemoteUnavailableComponent,
          data: { title: 'Admin Unavailable', message: `Admin remote could not be loaded from ${adminEntry}.` },
        }];
      }
    },
  },
  {
    path: 'member',
    canActivate: [authGuard],
    data: { roles: [RoleId.MEMBER] },
    loadChildren: async () => {
      const memberEntry = remoteConfig.find((c: any) => c.key === 'member')?.entry ?? 'http://localhost:4102/remoteEntry.mjs';
      try {
        const [
          ngCore,
          ngCorePrimitivesDi,
          ngCorePrimitivesSignals,
          ngCommon,
          ngCommonHttp,
          ngRouter,
          ngForms,
          ngPlatformBrowser,
          rxjs,
          rxjsOperators,
          sharedI18n,
        ] = await Promise.all([
          import('@angular/core'),
          import('@angular/core/primitives/di'),
          import('@angular/core/primitives/signals'),
          import('@angular/common'),
          import('@angular/common/http'),
          import('@angular/router'),
          import('@angular/forms'),
          import('@angular/platform-browser'),
          import('rxjs'),
          import('rxjs/operators'),
          import('@shared/i18n'),
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
        registerShare('@angular/core/primitives/di', ngCorePrimitivesDi, '21.2.10');
        registerShare('@angular/core/primitives/signals', ngCorePrimitivesSignals, '21.2.10');
        registerShare('@angular/common', ngCommon, '21.2.10');
        registerShare('@angular/common/http', ngCommonHttp, '21.2.10');
        registerShare('@angular/router', ngRouter, '21.2.10');
        registerShare('@angular/forms', ngForms, '21.2.10');
        registerShare('@angular/platform-browser', ngPlatformBrowser, '21.2.10');
        registerShare('rxjs', rxjs, '7.8.2');
        registerShare('rxjs/operators', rxjsOperators, '7.8.2');
        registerShare('@shared/i18n', sharedI18n, '0.0.0');

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
              message: `Member remote could not be loaded from ${memberEntry}.`,
            },
          },
        ];
      }
    },
  },
  {
    path: 'management',
    canActivate: [authGuard],
    data: { roles: [RoleId.MANAGER] },
    loadChildren: async () => {
      const mgmtConfig = remoteConfig.find((c: any) => c.key === 'management');
      if (!mgmtConfig) return [{ path: '', redirectTo: '/member', pathMatch: 'full' }];
      try {
        const loader = inject(RemoteLoaderService);
        const module = await loader.load(mgmtConfig);
        const mgmtRoutes = module?.mgmtRoutes || module?.routes || module?.default?.mgmtRoutes || module?.default?.routes;
        return mgmtRoutes || [{ path: '', redirectTo: '/member', pathMatch: 'full' }];
      } catch (error: any) {
        console.error('[shell] Management remote load FAILED:', error?.message || error);
        return [{
          path: '',
          component: RemoteUnavailableComponent,
          data: { title: 'Management Unavailable', message: 'Management remote could not be loaded.' },
        }];
      }
    },
  },
  
  // Default redirect to member app
  {
    path: '',
    redirectTo: '/member',
    pathMatch: 'full'
  },
  
  // All unmatched routes → member app
  { path: '**', redirectTo: '/member' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 4000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,
        closeButton: true,
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createSharedTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true,
    },
    provideAppInitializer(() => firstValueFrom(inject(SharedTranslationService).init('en')).then(() => void 0)),
    provideAuthInitializer(),
    {
      provide: AUTH_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/auth`,
    },
    {
      provide: AUTH_COOKIE_CONFIG,
      useValue: apiConfig.authCookies,
    },
    {
      provide: ADDRESS_LOOKUP_API_BASE_URL,
      useValue: apiConfig.baseUrl,
    },
    RemoteLoaderService,
  ],
};
