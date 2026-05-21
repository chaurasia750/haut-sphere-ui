import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { PropertyField, PropertyTypeItem } from '../../models/property-field.model';

export interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  isRequired?: boolean;
  options?: { label: string; value: string }[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf';
  url: string;
  preview: string;
}

function mapApiFieldToDynamicField(field: PropertyField): DynamicField {
  const typeMap: Record<string, 'text' | 'number' | 'select' | 'textarea'> = {
    dropdown: 'select',
    textbox: 'text',
    number: 'number',
    textarea: 'textarea',
  };
  return {
    key: field.fieldName,
    label: field.fieldLabel,
    type: typeMap[field.fieldType] || 'text',
    isRequired: field.isRequired,
    options: field.options.length > 0 ? field.options : undefined,
  };
}

@Component({
  selector: 'app-add-inventory-page',
  standalone: false,
  templateUrl: './add-inventory-page.component.html',
  styleUrls: ['./add-inventory-page.component.scss'],
})
export class AddInventoryPageComponent implements OnInit, OnDestroy {
  private readonly inventoryService = inject(InventoryService);
  private fieldsSub?: Subscription;
  private fieldsCache = new Map<string, DynamicField[]>();
  private pendingRequests = new Set<string>();

  selectedType = '';
  isDragging = false;
  propertyImage: string | null = null;
  loadingTypes = false;
  loadingFields = false;

  uploadedFiles: UploadedFile[] = [];

  propertyTypes: PropertyTypeItem[] = [];
  fieldDefinitions: DynamicField[] = [];

  formModel = {
    propertyName: '',
    locationUrl: '',
    dynamic: {} as Record<string, string>,
  };

  get currentType(): PropertyTypeItem | undefined {
    return this.propertyTypes.find(t => t.id === +this.selectedType);
  }

  get typeLabel(): string {
    return this.currentType?.name || '';
  }

  ngOnInit(): void {
    this.fetchPropertyTypes();
    this.prefetchFields('1');
  }

  ngOnDestroy(): void {
    this.fieldsSub?.unsubscribe();
  }

  private fetchPropertyTypes(): void {
    this.loadingTypes = true;
    this.inventoryService.getPropertyTypes().subscribe({
      next: (types) => {
        this.propertyTypes = types;
        this.loadingTypes = false;
      },
      error: () => {
        this.propertyTypes = [];
        this.loadingTypes = false;
      },
    });
  }

  onTypeChange(): void {
    if (!this.selectedType) return;
    this.formModel.dynamic = {};
    if (this.fieldsCache.has(this.selectedType)) {
      this.fieldDefinitions = this.fieldsCache.get(this.selectedType)!;
    } else {
      this.loadingFields = true;
      this.fetchFields(this.selectedType);
    }
  }

  private fetchFields(typeId: string): void {
    if (this.pendingRequests.has(typeId)) return;
    this.pendingRequests.add(typeId);
    this.fieldsSub?.unsubscribe();
    this.fieldsSub = this.inventoryService.getPropertyFields(typeId).subscribe({
      next: (fields) => {
        this.pendingRequests.delete(typeId);
        const mapped = fields.map(mapApiFieldToDynamicField);
        this.fieldsCache.set(typeId, mapped);
        if (this.selectedType === typeId) {
          this.fieldDefinitions = mapped;
          this.formModel.dynamic = {};
          this.loadingFields = false;
        }
      },
      error: () => this.pendingRequests.delete(typeId),
    });
  }

  private prefetchFields(typeId: string): void {
    this.inventoryService.getPropertyFields(typeId).subscribe({
      next: (fields) => {
        this.fieldsCache.set(typeId, fields.map(mapApiFieldToDynamicField));
      },
    });
  }

  onPropertyImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.propertyImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
  }

  removePropertyImage(event: Event): void {
    event.stopPropagation();
    this.propertyImage = null;
  }

  removeFile(id: string): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== id);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      input.value = '';
    }
  }

  onSubmit(): void {
    console.log('Submitting inventory:', this.formModel);
  }
}
