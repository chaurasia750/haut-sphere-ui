export interface PropertyFieldOption {
  label: string;
  value: string;
}

export interface PropertyField {
  id: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'dropdown' | 'number' | 'textbox' | 'textarea';
  isRequired: boolean;
  isFilterable: boolean;
  options: PropertyFieldOption[];
}

export interface PropertyTypeItem {
  id: number;
  name: string;
}
