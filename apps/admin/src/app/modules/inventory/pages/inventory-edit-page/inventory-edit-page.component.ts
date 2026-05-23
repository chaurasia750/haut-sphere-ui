import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventory-edit-page',
  standalone: false,
  templateUrl: './inventory-edit-page.component.html',
})
export class InventoryEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  editId: number | null = null;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editId = +id;
      }
    });
  }

  onSaved(id: number): void {
    this.router.navigate(['/admin/inventory', id]);
  }

  onCancelled(): void {
    this.router.navigate(['/admin/inventory/list']);
  }
}
