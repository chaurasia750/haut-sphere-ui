import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedLayoutModule } from '@shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSharedTranslateLoader } from '@shared';
import { AUTH_API_BASE_URL } from '@libs/shared/auth';
import { INVENTORY_API_BASE_URL } from './modules/inventory/services/inventory.service';
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
      provide: AUTH_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/auth`,
    },
    {
      provide: INVENTORY_API_BASE_URL,
      useValue: `${apiConfig.baseUrl}/inventory`,
    },
  ],
  exports: [AppComponent],
})
export class AppModule {}
