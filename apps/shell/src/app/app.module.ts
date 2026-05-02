import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ErrorBoundaryComponent } from './components/error-boundary/error-boundary.component';
import { AdminRedirectComponent } from './modules/admin-redirect/admin-redirect.component';
import { MemberRedirectComponent } from './modules/member-redirect/member-redirect.component';
import { ManagementRedirectComponent } from './modules/management-redirect/management-redirect.component';
import { LoginComponent } from './modules/login/login.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ErrorBoundaryComponent,
    AdminRedirectComponent,
    MemberRedirectComponent,
    ManagementRedirectComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  ngDoBootstrap() {
    // Standalone AppComponent is bootstrapped via bootstrapApplication in main.ts
  }
}
