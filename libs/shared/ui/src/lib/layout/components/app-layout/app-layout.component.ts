import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  templateUrl: './app-layout.component.html',
})
export class SharedAppLayoutComponent {
  @Input({ required: true }) config!: AppLayoutConfig;

  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }
}
