import { Injectable, InjectionToken } from '@angular/core';
import { PropertyField } from '../models/property-field.model';
import { DynamicField } from '../models/inventory-form.model';

export interface IPropertyFieldMapper {
  toDynamicField(field: PropertyField): DynamicField;
  toDynamicFields(fields: PropertyField[]): DynamicField[];
}

export const PROPERTY_FIELD_MAPPER = new InjectionToken<IPropertyFieldMapper>('PROPERTY_FIELD_MAPPER', {
  factory: () => new PropertyFieldMapper(),
});

@Injectable()
export class PropertyFieldMapper implements IPropertyFieldMapper {
  toDynamicField(field: PropertyField): DynamicField {
    const typeMap: Record<string, 'text' | 'number' | 'select' | 'textarea'> = {
      dropdown: 'select',
      textbox: 'text',
      number: 'number',
      textarea: 'textarea',
    };
    return {
      propertyFieldId: field.id,
      key: field.fieldName,
      label: field.fieldLabel,
      type: typeMap[field.fieldType] || 'text',
      isRequired: field.isRequired,
      options: field.options.length > 0 ? field.options : undefined,
    };
  }

  toDynamicFields(fields: PropertyField[]): DynamicField[] {
    return fields.map(f => this.toDynamicField(f));
  }
}
