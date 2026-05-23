import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  private readonly inventoryService = inject(INVENTORY_SERVICE);
  private readonly mediaService = inject(MediaService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() showAddButton: boolean = true;
  @Input() showEditButton: boolean = false;
  @Output() addInventory = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<number>();
  @Output() editInventory = new EventEmitter<number>();

  properties: PropertyListItem[] = [];
  loading = false;
  error = false;
  searchQuery = '';

  pageIndex = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  private loadReq: number = 0;

  getFileUrl(id: number | null | undefined): string | null {
    return id ? this.mediaService.getFileUrl(id) : null;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const reqId = ++this.loadReq;
    this.loading = true;
    this.error = false;

    const request: InventoryListRequest = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      title: this.searchQuery.trim() || undefined,
    };

    this.inventoryService.getPropertyList(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (reqId !== this.loadReq) return;
          this.properties = data?.items ?? [];
          this.totalCount = data?.totalCount ?? 0;
          this.totalPages = data?.totalPages ?? 0;
          this.pageIndex = data?.pageIndex ?? 1;
          this.loading = false;
        },
        error: () => {
          if (reqId !== this.loadReq) return;
          this.loading = false;
          this.error = true;
        },
      });
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
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
