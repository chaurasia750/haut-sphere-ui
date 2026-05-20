import { Component, Input } from '@angular/core';

interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder: string;
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
