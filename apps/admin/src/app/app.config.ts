import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

// For federated remote builds we must not register root router providers from
// inside the remote. The host (shell) provides the router. Keep only the
// global error listeners here so the remoteEntry doesn't bundle `provideRouter`.
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
