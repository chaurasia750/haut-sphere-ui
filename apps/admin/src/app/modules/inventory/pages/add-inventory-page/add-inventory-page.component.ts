import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-inventory-page',
  standalone: false,
  templateUrl: './add-inventory-page.component.html',
  styleUrls: ['./add-inventory-page.component.scss'],
})
export class AddInventoryPageComponent {
  private readonly router = inject(Router);

  onSaved(event: { id: number; isDraft: boolean }): void {
    if (event.isDraft) {
      this.router.navigate(['/admin/inventory/list']);
    } else {
      this.router.navigate(['/admin/inventory', event.id]);
    }
  }

  onCancelled(): void {
    this.router.navigate(['/admin/inventory/list']);
  }
}
