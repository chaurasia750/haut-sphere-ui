import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MediaService, TempUploadResult } from '@shared';
import { INVENTORY_SERVICE, IInventoryService } from '../../services/inventory.service';
import { PROPERTY_FIELD_MAPPER, IPropertyFieldMapper } from '../../services/property-field.mapper';
import { INVENTORY_PAYLOAD_BUILDER, IInventoryPayloadBuilder } from '../../services/inventory-payload.builder';
import { PropertyTypeItem } from '../../models/property-field.model';
import { DynamicField, UploadedFile } from '../../models/inventory-form.model';

@Component({
  selector: 'app-add-inventory-page',
  standalone: false,
  templateUrl: './add-inventory-page.component.html',
  styleUrls: ['./add-inventory-page.component.scss'],
})
export class AddInventoryPageComponent implements OnInit, OnDestroy {
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly mediaService = inject(MediaService);
  private readonly fieldMapper = inject(PROPERTY_FIELD_MAPPER);
  private readonly payloadBuilder = inject(INVENTORY_PAYLOAD_BUILDER);
  private readonly cdr = inject(ChangeDetectorRef);
  private fieldsSub?: Subscription;
  private fieldsCache = new Map<string, DynamicField[]>();
  private pendingRequests = new Set<string>();

  selectedType = '';
  isDragging = false;
  propertyImage: string | null = null;
  loadingTypes = false;
  loadingFields = false;
  uploadProgress: number | null = null;
  isUploading = false;
  isSaving = false;
  propertyImageId: number | null = null;

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
        if (types.length) {
          this.selectedType = String(types[0].id);
          this.onTypeChange();
        }
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
        const mapped = this.fieldMapper.toDynamicFields(fields);
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
        this.fieldsCache.set(typeId, this.fieldMapper.toDynamicFields(fields));
      },
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
      this.isUploading = true;
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
              this.isUploading = false;
              this.uploadProgress = null;
              this.cdr.detectChanges();
              break;
          }
        },
        error: (err) => {
          console.error('Photo upload failed:', err);
          this.isUploading = false;
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
    this.isUploading = true;
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
              this.isUploading = false;
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
            this.isUploading = false;
            this.uploadProgress = null;
            this.cdr.detectChanges();
            break;
        }
      },
      error: (err) => {
        console.error('File upload failed:', err);
        this.isUploading = false;
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
    if (this.isSaving) return;
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

    this.isSaving = true;
    this.inventoryService.createInventory(payload).subscribe({
      next: () => {
        this.isSaving = false;
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to create inventory:', err);
      },
    });
  }
}
