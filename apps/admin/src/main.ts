import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AUTH_API_BASE_URL } from '@libs/shared/auth';
import { apiConfig } from '@app/shell/environments/api.dev.config';

platformBrowserDynamic([
  {
    provide: AUTH_API_BASE_URL,
    useValue: `${apiConfig.baseUrl}/auth`,
  },
])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
