import { Injectable, InjectionToken } from '@angular/core';
import { CreateInventoryPayload, CreateInventoryField } from './inventory.service';
import { DynamicField, UploadedFile } from '../models/inventory-form.model';

export interface BuildPayloadData {
  selectedType: string;
  propertyName: string;
  fieldDefinitions: DynamicField[];
  dynamicValues: Record<string, string>;
  uploadedFiles: UploadedFile[];
  propertyImageId: number | null;
  status?: string;
}

export interface IInventoryPayloadBuilder {
  build(data: BuildPayloadData): CreateInventoryPayload;
}

export const INVENTORY_PAYLOAD_BUILDER = new InjectionToken<IInventoryPayloadBuilder>('INVENTORY_PAYLOAD_BUILDER', {
  factory: () => new InventoryPayloadBuilder(),
});

@Injectable()
export class InventoryPayloadBuilder implements IInventoryPayloadBuilder {
  build(data: BuildPayloadData): CreateInventoryPayload {
    const allFields: { field: DynamicField; value: string }[] = data.fieldDefinitions
      .map(f => ({ field: f, value: data.dynamicValues[f.key]?.trim() || '' }))
      .filter(x => x.value);

    const descriptionField = allFields.find(x => x.field.key === 'Description');
    const description = descriptionField?.value || '';
    const fields: CreateInventoryField[] = allFields
      .filter(x => x.field.key !== 'Description')
      .map(x => ({ propertyFieldId: x.field.propertyFieldId, value: x.value }));

    const payload: CreateInventoryPayload = {
      propertyTypeId: +data.selectedType,
      title: data.propertyName.trim(),
      description,
      fields: fields.length ? fields : [],
      documentIds: data.uploadedFiles.map(f => f.fileId),
      profileId: data.propertyImageId ?? 0,
    };
    if (data.status) payload.status = data.status;
    return payload;
  }
}
