import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedLayoutModule } from '@shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSharedTranslateLoader, SharedTranslationService } from '@shared/i18n';
import { firstValueFrom } from 'rxjs';
import { AUTH_API_BASE_URL } from '@libs/shared/auth';
import { INVENTORY_API_BASE_URL } from '@shared/inventory/src';
import { LEAD_API_BASE_URL } from '@shared/leads/src';
import { MEMBERS_API_BASE_URL } from '@shared/members/src';
import { apiConfig } from '@shared/environments/api.dev';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
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
    RouterModule,
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
    {
      provide: AUTH_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/auth`,
    },
    {
      provide: INVENTORY_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/inventory`,
    },
    {
      provide: LEAD_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/leads`,
    },
    {
      provide: MEMBERS_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/members`,
    },
  ],
  exports: [AppComponent],
})
export class AppModule {}
