import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedLayoutModule } from '@shared';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    SharedLayoutModule,
    AppRoutingModule,
  ],
  exports: [AppComponent],
})
export class AppModule {}
