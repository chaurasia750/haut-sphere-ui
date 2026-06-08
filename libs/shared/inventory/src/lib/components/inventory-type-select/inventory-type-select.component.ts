import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INVENTORY_SERVICE } from '../../services/inventory.service';
import { PropertyTypeItem } from '../../models/property-field.model';

@Component({
  selector: 'lib-inventory-type-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-type-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryTypeSelectComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) formGroup!: FormGroup;
  @Input() typeControlName = 'inventoryTypeId';
  @Input() propertyControlName = 'inventoryPropertyId';

  types: PropertyTypeItem[] = [];
  properties: PropertyTypeItem[] = [];
  loadingTypes = true;
  loadingProperties = false;

  ngOnInit(): void {
    this.loadTypes();

    this.formGroup.get(this.typeControlName)?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((typeId) => {
        this.formGroup.get(this.propertyControlName)?.setValue('', { emitEvent: false });
        this.properties = [];
        if (typeId) {
          this.loadProperties(typeId);
        }
        this.cdr.markForCheck();
      });
  }

  private loadTypes(): void {
    this.inventoryService.getPropertyTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.types = data; this.loadingTypes = false; this.cdr.markForCheck(); },
        error: () => { this.types = []; this.loadingTypes = false; this.cdr.markForCheck(); },
      });
  }

  private loadProperties(typeId: number): void {
    this.loadingProperties = true;
    this.cdr.markForCheck();
    this.inventoryService.getPropertiesByTypeId(typeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.properties = data; this.loadingProperties = false; this.cdr.markForCheck(); },
        error: () => { this.properties = []; this.loadingProperties = false; this.cdr.markForCheck(); },
      });
  }
}
