import { NgModule } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedLayoutModule } from '@shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSharedTranslateLoader } from '@shared';
import { AUTH_API_BASE_URL } from '@libs/shared/auth';
import { apiConfig } from '@app/shell/environments/api.dev.config';

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
    SharedLayoutModule,
    AppRoutingModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: AUTH_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/auth`,
    },
  ],
  exports: [AppComponent],
})
export class AppModule {}
