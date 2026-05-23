import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MediaService } from '@shared';
import { PropertyDetail, PropertyDetailField, PropertyFile } from '../../models/property-detail.model';
import { PropertyTypeItem } from '../../models/property-field.model';
import { INVENTORY_SERVICE, IInventoryService } from '../../services/inventory.service';

@Component({
  selector: 'lib-inventory-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss'],
})
export class InventoryDetailsComponent implements OnInit {
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly mediaService = inject(MediaService);

  @Input() propertyId!: number;
  @Input() showActions: boolean = true;
  @Input() backRoute: string = '';
  @Output() back = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();

  property: PropertyDetail | null = null;
  fields: PropertyDetailField[] = [];
  files: PropertyFile[] = [];
  propertyTypes: PropertyTypeItem[] = [];
  loading = false;
  error = false;
  acting = false;

  get profileImageUrl(): string | null {
    const profile = this.property?.profile;
    if (profile?.mediaDetails?.id) {
      return this.mediaService.getFileUrl(profile.mediaDetails.id);
    }
    return null;
  }

  get propertyTypeLabel(): string {
    const type = this.propertyTypes.find(t => t.id === this.property?.propertyType);
    return type?.name || `Type #${this.property?.propertyType}`;
  }

  get statusLabel(): string {
    if (this.property?.isActive) return 'Active';
    if (this.property?.status === 'closed') return 'Closed';
    return 'Draft';
  }

  get statusBadgeClass(): Record<string, boolean> {
    return {
      'bg-emerald-50 text-emerald-700': !!this.property?.isActive,
      'bg-gray-50 text-gray-600': !this.property?.isActive && this.property?.status !== 'closed',
      'bg-red-50 text-red-700': this.property?.status === 'closed',
    };
  }

  get statusDotClass(): Record<string, boolean> {
    return {
      'bg-emerald-500': !!this.property?.isActive,
      'bg-gray-400': !this.property?.isActive && this.property?.status !== 'closed',
      'bg-red-500': this.property?.status === 'closed',
    };
  }

  ngOnInit(): void {
    this.fetchProperty();
  }

  private fetchProperty(): void {
    if (!this.propertyId) return;
    this.loading = true;
    this.error = false;
    this.inventoryService.getPropertyById(this.propertyId).subscribe({
      next: (data) => {
        this.property = data;
        this.fields = data.fields || [];
        this.files = data.files || [];
        this.loading = false;
        this.fetchPropertyTypes();
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  private fetchPropertyTypes(): void {
    this.inventoryService.getPropertyTypes().subscribe({
      next: (types) => {
        this.propertyTypes = types;
      },
    });
  }

  fileUrl(file: PropertyFile): string {
    if (file.mediaDetails?.id) {
      return this.mediaService.getFileUrl(file.mediaDetails.id);
    }
    return '#';
  }

  fileIcon(file: PropertyFile): string {
    const ct = file.mediaDetails?.contentType || '';
    if (ct.startsWith('image/')) return 'image';
    if (ct.includes('pdf')) return 'pdf';
    if (ct.includes('word') || ct.includes('document')) return 'word';
    if (ct.includes('excel') || ct.includes('spreadsheet')) return 'excel';
    return 'file';
  }

  activate(): void {
    if (!this.property || this.acting) return;
    this.acting = true;
    this.inventoryService.activateProperty(this.property.id).subscribe({
      next: () => {
        if (this.property) this.property.isActive = true;
        this.acting = false;
      },
      error: () => this.acting = false,
    });
  }

  deactivate(): void {
    if (!this.property || this.acting) return;
    this.acting = true;
    this.inventoryService.deactivateProperty(this.property.id).subscribe({
      next: () => {
        if (this.property) this.property.isActive = false;
        this.acting = false;
      },
      error: () => this.acting = false,
    });
  }

  closeInventory(): void {
    if (!this.property || this.acting) return;
    this.acting = true;
    this.inventoryService.closeProperty(this.property.id).subscribe({
      next: () => {
        if (this.property) {
          this.property.isActive = false;
          this.property.status = 'closed';
        }
        this.acting = false;
      },
      error: () => this.acting = false,
    });
  }

  goBack(): void {
    this.back.emit();
  }

  onEdit(): void {
    if (this.property) {
      this.edit.emit(this.property.id);
    }
  }
}
