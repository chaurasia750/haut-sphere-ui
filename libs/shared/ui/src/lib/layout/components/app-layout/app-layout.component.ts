import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutConfig } from '../../models/layout.models';
import { SidebarService } from '../../services/sidebar.service';
import { SharedAppFooterComponent } from '../app-footer/app-footer.component';
import { SharedAppHeaderComponent } from '../app-header/app-header.component';
import { SharedAppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { BackdropComponent } from '../backdrop/backdrop.component';

@Component({
  selector: 'shared-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedAppHeaderComponent,
    SharedAppSidebarComponent,
    SharedAppFooterComponent,
    BackdropComponent,
  ],
  template: `<div class="min-h-screen xl:flex">
  <div>
    <shared-app-sidebar [config]="config"></shared-app-sidebar>
    <shared-backdrop></shared-backdrop>
  </div>

  <div
    class="flex-1 transition-all duration-300 ease-in-out"
    [ngClass]="{
      'xl:ml-[280px]': (isExpanded$ | async) || (isHovered$ | async),
      'xl:ml-[90px]': !(isExpanded$ | async) && !(isHovered$ | async),
      'ml-0': (isMobileOpen$ | async)
    }"
  >
    <shared-app-header
      [brandName]="config.brandName || config.appName"
      [userName]="config.user?.name || 'Member User'"
      [userRole]="config.user?.role || config.appName"
      [notifications]="config.notifications || []"
      (signOut)="signOut.emit()"
    ></shared-app-header>
    <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
      <router-outlet></router-outlet>
    </div>
    @if (config.footerText) {
      <shared-app-footer [text]="config.footerText"></shared-app-footer>
    }
  </div>
</div>`,
})
export class SharedAppLayoutComponent {
  @Input({ required: true }) config!: AppLayoutConfig;
  @Output() signOut = new EventEmitter<void>();

  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }
}
