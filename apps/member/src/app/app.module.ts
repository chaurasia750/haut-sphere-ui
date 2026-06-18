import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSharedTranslateLoader, SharedTranslationService } from '@shared/i18n';
import { firstValueFrom } from 'rxjs';
import { AUTH_API_BASE_URL } from '@libs/shared/auth';
import { apiConfig } from '@shared/environments/api.dev';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createSharedTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const service = inject(SharedTranslationService);
        return () => firstValueFrom(service.init('en'));
      },
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: AUTH_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/auth`,
    },
  ],
  exports: [AppComponent],
})
export class AppModule {}
