import { NgModule } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedLayoutModule } from '@shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSharedTranslateLoader } from '@shared';

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
  ],
  exports: [AppComponent],
})
export class AppModule {}
