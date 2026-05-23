import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() pageIndex: number = 1;
  @Input() totalPages: number = 0;
  @Input() totalCount: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageIndex) return;
    this.pageChange.emit(page);
  }
}
