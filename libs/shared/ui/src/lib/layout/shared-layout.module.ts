import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedAppLayoutComponent } from './components/app-layout/app-layout.component';
import { SharedAppHeaderComponent } from './components/app-header/app-header.component';
import { SharedAppSidebarComponent } from './components/app-sidebar/app-sidebar.component';
import { SharedAppFooterComponent } from './components/app-footer/app-footer.component';
import { BackdropComponent } from './components/backdrop/backdrop.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedAppLayoutComponent,
    SharedAppHeaderComponent,
    SharedAppSidebarComponent,
    SharedAppFooterComponent,
    BackdropComponent,
  ],
  exports: [
    SharedAppLayoutComponent,
    SharedAppHeaderComponent,
    SharedAppSidebarComponent,
    SharedAppFooterComponent,
    BackdropComponent,
  ],
})
export class SharedLayoutModule {}
