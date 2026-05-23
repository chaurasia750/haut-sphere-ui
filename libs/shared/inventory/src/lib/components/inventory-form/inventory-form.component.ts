import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MediaService, TempUploadResult } from '@shared';
import { INVENTORY_SERVICE, IInventoryService } from '../../services/inventory.service';
import { PROPERTY_FIELD_MAPPER, IPropertyFieldMapper } from '../../services/property-field.mapper';
import { INVENTORY_PAYLOAD_BUILDER, IInventoryPayloadBuilder } from '../../services/inventory-payload.builder';
import { PropertyTypeItem } from '../../models/property-field.model';
import { DynamicField, UploadedFile } from '../../models/inventory-form.model';
import { PropertyDetail } from '../../models/property-detail.model';
import { DynamicFieldsCardComponent } from '../dynamic-fields-card/dynamic-fields-card.component';
import { InventorySummaryCardComponent } from '../inventory-summary-card/inventory-summary-card.component';
import { UiButtonComponent, UiLoadingSpinnerComponent } from '@shared/ui/src';

@Component({
  selector: 'lib-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFieldsCardComponent, InventorySummaryCardComponent, UiButtonComponent, UiLoadingSpinnerComponent],
  templateUrl: './inventory-form.component.html',
})
export class InventoryFormComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly mediaService = inject(MediaService);
  private readonly fieldMapper = inject(PROPERTY_FIELD_MAPPER);
  private readonly payloadBuilder = inject(INVENTORY_PAYLOAD_BUILDER);
  private readonly destroyRef = inject(DestroyRef);
  private fieldsSub?: Subscription;
  private fieldsCache = new Map<string, DynamicField[]>();
  private pendingRequests = new Set<string>();

  private _editId: number | null = null;
  private isLoadingExistingData = false;
  @Input() set editId(value: number | null) {
    this._editId = value;
  }
  get editId(): number | null {
    return this._editId;
  }
  @Output() readonly saved = new EventEmitter<{ id: number; isDraft: boolean }>();
  @Output() readonly cancelled = new EventEmitter<void>();

  selectedType = '';
  isDragging = false;
  propertyImage: string | null = null;
  propertyImageId: number | null = null;
  uploadProgress: number | null = null;
  uploadedFiles: UploadedFile[] = [];
  fieldDefinitions: DynamicField[] = [];
  propertyTypes: PropertyTypeItem[] = [];

  readonly loadingTypes = signal(false);
  readonly loadingFields = signal(false);
  readonly isUploading = signal(false);
  readonly isSaving = signal(false);
  readonly isLoadingEditData = signal(false);

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

  get isEditMode(): boolean {
    return this._editId !== null;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Inventory' : 'Add Inventory';
  }

  ngOnInit(): void {
    this.fetchPropertyTypes();
  }

  private loadExistingData(): void {
    if (!this._editId || this.isLoadingExistingData) return;
    this.isLoadingExistingData = true;
    this.isLoadingEditData.set(true);
    this.inventoryService.getPropertyById(this._editId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        this.populateForm(data);
        this.isLoadingEditData.set(false);
      },
      error: () => {
        this.isLoadingEditData.set(false);
      },
    });
  }

  private populateForm(data: PropertyDetail): void {
    this.formModel.propertyName = data.title;
    this.selectedType = String(data.propertyType);
    this.propertyImageId = data.profile?.mediaDetails?.id ?? null;
    if (this.propertyImageId) {
      this.propertyImage = this.mediaService.getFileUrl(this.propertyImageId);
    }
    if (data.files?.length) {
      this.uploadedFiles = data.files.map(f => ({
        id: crypto.randomUUID(),
        fileId: f.mediaDetails?.id ?? 0,
        name: f.mediaDetails?.originalFileName || f.mediaDetails?.fileName || 'File',
        size: '',
        type: (f.mediaDetails?.contentType?.startsWith('image/')) ? 'image' as const : 'pdf' as const,
        url: f.mediaDetails?.id ? this.mediaService.getFileUrl(f.mediaDetails.id) : '',
        preview: '',
      }));
    }
    this.onTypeChange();
    if (data.fields?.length) {
      setTimeout(() => {
        for (const f of data.fields) {
          this.formModel.dynamic[f.fieldName] = f.value;
        }
      });
    }
  }

  private fetchPropertyTypes(): void {
    this.loadingTypes.set(true);
    this.inventoryService.getPropertyTypes().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (types) => {
        this.propertyTypes = types;
        this.loadingTypes.set(false);
        if (!this._editId && types.length) {
          this.selectedType = String(types[0].id);
          this.onTypeChange();
        }
        if (this.isEditMode) {
          this.loadExistingData();
        }
      },
      error: () => {
        this.propertyTypes = [];
        this.loadingTypes.set(false);
      },
    });
  }

  onTypeChange(): void {
    if (!this.selectedType) return;
    this.formModel.dynamic = {};
    if (this.fieldsCache.has(this.selectedType)) {
      this.fieldDefinitions = this.fieldsCache.get(this.selectedType)!;
    } else {
      this.loadingFields.set(true);
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
        const mapped = this.fieldMapper.toDynamicFields(fields);
        this.fieldsCache.set(typeId, mapped);
        if (this.selectedType === typeId) {
          this.fieldDefinitions = mapped;
          this.formModel.dynamic = {};
          this.loadingFields.set(false);
        }
      },
      error: () => this.pendingRequests.delete(typeId),
    });
  }

  onPropertyImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.propertyImage = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      this.isUploading.set(true);
      this.uploadProgress = 0;
      this.mediaService.tempUploadWithProgress([file]).subscribe({
        next: (event: HttpEvent<TempUploadResult>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.uploadProgress = Math.round(100 * event.loaded / (event.total ?? event.loaded));
              this.cdr.detectChanges();
              break;
            case HttpEventType.Response:
              const res = event.body;
              if (res?.files?.length) {
                this.propertyImageId = res.files[0].id;
                this.propertyImage = this.mediaService.getFileUrl(res.files[0].id);
              }
              this.isUploading.set(false);
              this.uploadProgress = null;
              this.cdr.detectChanges();
              break;
          }
        },
        error: () => {
          this.isUploading.set(false);
          this.uploadProgress = null;
          this.cdr.detectChanges();
        },
      });
    }
    input.value = '';
  }

  removePropertyImage(event: Event): void {
    event.stopPropagation();
    this.propertyImage = null;
    this.propertyImageId = null;
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
    if (event.dataTransfer?.files.length) {
      this.uploadFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadFiles(Array.from(input.files));
    }
    input.value = '';
  }

  private uploadFiles(files: File[]): void {
    this.isUploading.set(true);
    this.uploadProgress = 0;
    this.mediaService.tempUploadWithProgress(files).subscribe({
      next: (event: HttpEvent<TempUploadResult>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(100 * event.loaded / (event.total ?? event.loaded));
            this.cdr.detectChanges();
            break;
          case HttpEventType.Response:
            const res = event.body;
            if (!res?.files?.length) {
              this.isUploading.set(false);
              this.uploadProgress = null;
              this.cdr.detectChanges();
              return;
            }
            this.uploadedFiles = [...this.uploadedFiles, ...res.files.map((f, i) => {
              const file = files[i];
              const fullUrl = this.mediaService.getFileUrl(f.id);
              return {
                id: crypto.randomUUID(),
                fileId: f.id,
                name: f.fileName || file.name,
                size: this.formatSize(file.size),
                type: file.type.startsWith('image/') ? 'image' as const : 'pdf' as const,
                url: fullUrl,
                preview: file.type.startsWith('image/') ? fullUrl : '',
              };
            })];
            this.isUploading.set(false);
            this.uploadProgress = null;
            this.cdr.detectChanges();
            break;
        }
      },
      error: () => {
        this.isUploading.set(false);
        this.uploadProgress = null;
        this.cdr.detectChanges();
      },
    });
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  onSubmit(status?: string): void {
    if (this.isSaving()) return;
    if (!this.selectedType) return;
    if (!this.formModel.propertyName.trim()) return;

    const payload = this.payloadBuilder.build({
      selectedType: this.selectedType,
      propertyName: this.formModel.propertyName,
      fieldDefinitions: this.fieldDefinitions,
      dynamicValues: this.formModel.dynamic,
      uploadedFiles: this.uploadedFiles,
      propertyImageId: this.propertyImageId,
      status,
    });

    this.isSaving.set(true);
    const request = this.isEditMode && this.editId
      ? this.inventoryService.updateProperty(this.editId, payload)
      : this.inventoryService.createInventory(payload);

    request.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (result: any) => {
        this.isSaving.set(false);
        const id = typeof result === 'number' ? result : result?.id;
        if (id) {
          this.saved.emit({ id, isDraft: status === 'draft' });
        }
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
