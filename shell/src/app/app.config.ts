import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { RemoteLoaderService } from './services/remote-loader.service';
import { AuthService, ErrorHandlerService, LoggingService, AuthHttpInterceptor } from '@shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(appRoutes),
    provideHttpClient(),
    // Shared services
    AuthService,
    ErrorHandlerService,
    LoggingService,
    // Custom services
    RemoteLoaderService,
    // HTTP interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
};
