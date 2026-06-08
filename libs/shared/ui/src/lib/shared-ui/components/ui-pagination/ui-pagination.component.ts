import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <div class="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <span class="text-xs text-gray-500">
          Showing {{ (pageIndex - 1) * pageSize + 1 }}&ndash;{{ Math.min(pageIndex * pageSize, totalCount) }} of {{ totalCount }}
        </span>
        <nav class="flex items-center gap-1">
          <button (click)="goToPage(pageIndex - 1)" [disabled]="pageIndex <= 1"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-xs text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          @for (p of pages; track p) {
            <button (click)="goToPage(p)"
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors"
              [ngClass]="p === pageIndex ? 'bg-[#FFC107] text-black shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
              {{ p }}
            </button>
          }
          <button (click)="goToPage(pageIndex + 1)" [disabled]="pageIndex >= totalPages"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-xs text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </nav>
      </div>
    }
  `,
})
export class UiPaginationComponent {
  readonly Math = Math;
  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalCount: number = 0;
  @Input() totalPages: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.pageIndex - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageIndex) return;
    this.pageChange.emit(page);
  }
}
