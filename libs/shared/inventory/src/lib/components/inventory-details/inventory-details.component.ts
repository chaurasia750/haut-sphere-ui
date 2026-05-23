import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, Input, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MediaService } from '@shared';
import { PropertyDetail, PropertyDetailField, PropertyFile } from '../../models/property-detail.model';
import { PropertyTypeItem } from '../../models/property-field.model';
import { INVENTORY_SERVICE, IInventoryService } from '../../services/inventory.service';

@Component({
  selector: 'lib-inventory-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-details.component.html',
})
export class InventoryDetailsComponent {
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly mediaService = inject(MediaService);
  private readonly destroyRef = inject(DestroyRef);

  private _propertyId = 0;
  @Input() set propertyId(value: number) {
    this._propertyId = value;
    if (value) this.fetchProperty();
  }

  readonly showActions = input(true);
  readonly backRoute = input('');
  readonly back = output<void>();
  readonly edit = output<number>();

  readonly property = signal<PropertyDetail | null>(null);
  readonly fields = signal<PropertyDetailField[]>([]);
  readonly files = signal<PropertyFile[]>([]);
  readonly propertyTypes = signal<PropertyTypeItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly acting = signal(false);

  readonly profileImageUrl = computed(() => {
    const profile = this.property()?.profile;
    if (profile?.mediaDetails?.id) {
      return this.mediaService.getFileUrl(profile.mediaDetails.id);
    }
    return null;
  });

  readonly propertyTypeLabel = computed(() => {
    const type = this.propertyTypes().find(t => t.id === this.property()?.propertyType);
    return type?.name || `Type #${this.property()?.propertyType}`;
  });

  readonly statusLabel = computed(() => {
    if (this.property()?.isActive) return 'Active';
    if (this.property()?.status === 'closed') return 'Closed';
    return 'Draft';
  });

  readonly statusBadgeClass = computed(() => ({
    'bg-emerald-50 text-emerald-700': !!this.property()?.isActive,
    'bg-gray-50 text-gray-600': !this.property()?.isActive && this.property()?.status !== 'closed',
    'bg-red-50 text-red-700': this.property()?.status === 'closed',
  }));

  readonly statusDotClass = computed(() => ({
    'bg-emerald-500': !!this.property()?.isActive,
    'bg-gray-400': !this.property()?.isActive && this.property()?.status !== 'closed',
    'bg-red-500': this.property()?.status === 'closed',
  }));

  private fetchProperty(): void {
    if (!this._propertyId) return;
    this.loading.set(true);
    this.error.set(false);
    this.inventoryService.getPropertyById(this._propertyId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        this.property.set(data);
        this.fields.set(data.fields || []);
        this.files.set(data.files || []);
        this.loading.set(false);
        this.fetchPropertyTypes();
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  private fetchPropertyTypes(): void {
    this.inventoryService.getPropertyTypes().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (types) => this.propertyTypes.set(types),
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
    if (!this.property() || this.acting()) return;
    this.acting.set(true);
    this.inventoryService.activateProperty(this.property()!.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.property.update(p => p ? { ...p, isActive: true } : p);
        this.acting.set(false);
      },
      error: () => this.acting.set(false),
    });
  }

  deactivate(): void {
    if (!this.property() || this.acting()) return;
    this.acting.set(true);
    this.inventoryService.deactivateProperty(this.property()!.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.property.update(p => p ? { ...p, isActive: false } : p);
        this.acting.set(false);
      },
      error: () => this.acting.set(false),
    });
  }

  closeInventory(): void {
    if (!this.property() || this.acting()) return;
    this.acting.set(true);
    this.inventoryService.closeProperty(this.property()!.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.property.update(p => p ? { ...p, isActive: false, status: 'closed' } : p);
        this.acting.set(false);
      },
      error: () => this.acting.set(false),
    });
  }

  goBack(): void {
    this.back.emit();
  }

  onEdit(): void {
    if (this.property()) {
      this.edit.emit(this.property()!.id);
    }
  }
}
