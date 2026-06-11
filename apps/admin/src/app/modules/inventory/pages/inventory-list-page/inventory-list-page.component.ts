import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list-page',
  standalone: false,
  templateUrl: './inventory-list-page.component.html',
})
export class InventoryListPageComponent {
  private readonly router = inject(Router);

  onAddInventory(): void {
    this.router.navigate(['/admin/inventory/add-inventory']);
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/admin/inventory', id]);
  }

  onEditInventory(id: number): void {
    this.router.navigate(['/admin/inventory', id, 'edit']);
  }

  onAddLeadFromInventory(propertyId: number): void {
    this.router.navigate(['/admin/leads/add'], { queryParams: { propertyId } });
  }
}
