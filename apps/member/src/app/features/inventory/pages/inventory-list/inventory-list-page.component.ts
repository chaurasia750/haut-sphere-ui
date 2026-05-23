import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryListComponent } from '@shared/inventory/src';

@Component({
  selector: 'app-member-inventory-list',
  standalone: true,
  imports: [InventoryListComponent],
  template: `<lib-inventory-list
    [showAddButton]="false"
    (viewDetails)="onViewDetails($event)">
  </lib-inventory-list>`,
})
export class MemberInventoryListPageComponent {
  private readonly router = inject(Router);

  onViewDetails(id: number): void {
    this.router.navigate(['/member/inventory', id]);
  }
}
