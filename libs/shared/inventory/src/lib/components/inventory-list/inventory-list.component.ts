import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PropertyListItem, InventoryListRequest } from '../../models/property-detail.model';
import { INVENTORY_SERVICE, IInventoryService } from '../../services/inventory.service';
import { MediaService } from '@shared';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'lib-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './inventory-list.component.html',
})
export class InventoryListComponent implements OnInit {
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly mediaService = inject(MediaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly showAddButton = input(true);
  readonly showEditButton = input(false);
  readonly addInventory = output<void>();
  readonly viewDetails = output<number>();
  readonly editInventory = output<number>();

  readonly properties = signal<PropertyListItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  searchQuery = '';

  readonly pageIndex = signal(1);
  readonly pageSize = 20;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);

  private loadReq = 0;

  getFileUrl(id: number | null | undefined): string | null {
    return id ? this.mediaService.getFileUrl(id) : null;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const reqId = ++this.loadReq;
    this.loading.set(true);
    this.error.set(false);

    const request: InventoryListRequest = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize,
      title: this.searchQuery.trim() || undefined,
    };

    this.inventoryService.getPropertyList(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (reqId !== this.loadReq) return;
          this.properties.set(data?.items ?? []);
          this.totalCount.set(data?.totalCount ?? 0);
          this.totalPages.set(data?.totalPages ?? 0);
          this.pageIndex.set(data?.pageIndex ?? 1);
          this.loading.set(false);
        },
        error: () => {
          if (reqId !== this.loadReq) return;
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  onSearch(): void {
    this.pageIndex.set(1);
    this.loadData();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadData();
  }

  onViewDetails(id: number): void {
    this.viewDetails.emit(id);
  }

  onEdit(event: Event, id: number): void {
    event.stopPropagation();
    this.editInventory.emit(id);
  }

  onAdd(): void {
    this.addInventory.emit();
  }
}
