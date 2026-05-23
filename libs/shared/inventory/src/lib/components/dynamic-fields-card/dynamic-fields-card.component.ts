import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicField } from '../../models/inventory-form.model';

@Component({
  selector: 'lib-dynamic-fields-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-fields-card.component.html',
  styleUrls: ['./dynamic-fields-card.component.scss'],
})
export class DynamicFieldsCardComponent {
  @Input() fields: DynamicField[] = [];
  @Input() values: Record<string, string> = {};
  @Input() typeLabel: string = '';
  @Input() readOnly: boolean = false;
}
