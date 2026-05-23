import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventory-details-page',
  standalone: false,
  templateUrl: './inventory-details-page.component.html',
  styleUrls: ['./inventory-details-page.component.scss'],
})
export class InventoryDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  propertyId: number = 0;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.propertyId = +id;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/inventory/list']);
  }

  editInventory(id: number): void {
    this.router.navigate(['/admin/inventory', id, 'edit']);
  }
}
