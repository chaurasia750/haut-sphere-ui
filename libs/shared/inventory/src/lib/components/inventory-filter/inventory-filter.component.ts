import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { INVENTORY_SERVICE, IInventoryService } from '../../services/inventory.service';
import { PropertyTypeItem } from '../../models/property-field.model';

export interface InventoryFilter {
  searchQuery: string;
  propertyTypeId: number | null;
}

@Component({
  selector: 'lib-inventory-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex items-center gap-2 sm:w-72 h-10 px-3 rounded-lg border border-gray-300 bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/30">
        <svg class="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" [(ngModel)]="searchQuery" (input)="onFilterChange()" placeholder="Search by name..."
          class="flex-1 h-full text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none p-0 focus:outline-none focus:ring-0"/>
      </div>
      <div class="relative sm:w-56">
        <select [(ngModel)]="selectedTypeId" (change)="onFilterChange()"
          class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 focus:outline-none cursor-pointer appearance-none">
          <option [ngValue]="null">All Types</option>
          @for (t of propertyTypes; track t.id) {
            <option [ngValue]="t.id">{{ t.name }}</option>
          }
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <button (click)="onFilterChange()"
        class="h-10 px-5 rounded-lg bg-brand-500 text-sm font-medium text-black hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-1 whitespace-nowrap transition-colors">
        Search
      </button>
    </div>
  `,
})
export class InventoryFilterComponent implements OnInit {
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly destroyRef = inject(DestroyRef);

  readonly filterChange = output<InventoryFilter>();

  searchQuery = '';
  selectedTypeId: number | null = null;
  propertyTypes: PropertyTypeItem[] = [];

  ngOnInit(): void {
    this.inventoryService.getPropertyTypes().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (types) => this.propertyTypes = types,
    });
  }

  onFilterChange(): void {
    this.filterChange.emit({
      searchQuery: this.searchQuery.trim(),
      propertyTypeId: this.selectedTypeId,
    });
  }
}
