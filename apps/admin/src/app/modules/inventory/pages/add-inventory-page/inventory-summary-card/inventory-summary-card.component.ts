import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inventory-summary-card',
  standalone: false,
  templateUrl: './inventory-summary-card.component.html',
})
export class InventorySummaryCardComponent {
  @Input() propertyImage: string | null = null;
  @Input() propertyName: string = '';
  @Input() location: string = '';
  @Input() locationUrl: string = '';
  @Input() category: string = '';
  @Input() price: number | null = null;
  @Input() area: number | null = null;
  @Input() bhk: string = '';
  @Input() typeLabel: string = '';
  @Input() description: string = '';
  @Input() uploadedFiles: any[] = [];
}
