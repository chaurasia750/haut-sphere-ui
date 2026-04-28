import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RemoteContainerComponent } from './components/remote-container.component';
import { ShellLayoutComponent } from './components/shell-layout.component';
import { LayoutComponent } from './layout/layout.component';
import { RemoteLoaderService } from './services/remote-loader.service';

// Shared library imports
import { AuthService, ErrorHandlerService, LoggingService, AuthHttpInterceptor } from '@shared';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    // Import standalone components
    AppComponent,
    ShellLayoutComponent,
    RemoteContainerComponent,
    LayoutComponent,
  ],
  providers: [
    AuthService,
    ErrorHandlerService,
    LoggingService,
    RemoteLoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
