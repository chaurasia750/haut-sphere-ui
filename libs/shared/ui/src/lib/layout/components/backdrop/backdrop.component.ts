import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'shared-backdrop',
  standalone: true,
  imports: [CommonModule],
  template: `@if (isMobileOpen$ | async) {
  <div
    class="fixed inset-0 z-[999999] bg-gray-900/50 lg:hidden"
    (click)="closeSidebar()"
  ></div>
}`,
})
export class BackdropComponent {
  readonly isMobileOpen$;

  constructor(private readonly sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  closeSidebar() {
    this.sidebarService.setMobileOpen(false);
  }
}
