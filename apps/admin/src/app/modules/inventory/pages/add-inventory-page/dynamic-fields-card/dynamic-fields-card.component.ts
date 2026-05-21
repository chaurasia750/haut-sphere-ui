import { Component, Input } from '@angular/core';

export interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  isRequired?: boolean;
  options?: { label: string; value: string }[];
}

@Component({
  selector: 'app-dynamic-fields-card',
  standalone: false,
  templateUrl: './dynamic-fields-card.component.html',
})
export class DynamicFieldsCardComponent {
  @Input() fields: DynamicField[] = [];
  @Input() values: Record<string, string> = {};
  @Input() typeLabel: string = '';
}
