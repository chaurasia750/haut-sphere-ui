import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryDetailsComponent } from '@shared/inventory/src';

@Component({
  selector: 'app-member-inventory-details',
  standalone: true,
  imports: [InventoryDetailsComponent],
  template: `<lib-inventory-details
    [propertyId]="propertyId"
    [showActions]="false"
    (back)="goBack()">
  </lib-inventory-details>`,
})
export class MemberInventoryDetailsPageComponent {
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
    this.router.navigate(['/member/inventory/list']);
  }
}
