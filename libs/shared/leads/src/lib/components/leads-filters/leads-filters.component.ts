import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedDateRangePickerComponent } from '@shared/ui/src';
import { SharedUserSelectComponent } from '../shared-user-select/shared-user-select.component';
import { SharedLeadStatusSelectComponent } from '../shared-lead-status-select/shared-lead-status-select.component';
import { SharedLeadSourceSelectComponent } from '../shared-lead-source-select/shared-lead-source-select.component';

export interface LeadFilters {
  page: number;
  pageSize: number;
  search: string;
  statusId: number | string;
  sourceId: number | string;
  assignedUserId: number | string;
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'lib-leads-filters',
  standalone: true,
  imports: [
    CommonModule, FormsModule, SharedDateRangePickerComponent,
    SharedUserSelectComponent, SharedLeadStatusSelectComponent,
    SharedLeadSourceSelectComponent,
  ],
  templateUrl: './leads-filters.component.html',
})
export class LeadsFiltersComponent {
  @Output() filterChange = new EventEmitter<LeadFilters>();

  readonly filtersOpen = signal(false);

  search = '';
  statusId: number | string = '';
  sourceId: number | string = '';
  assignedUserId: number | string = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  toggleFilters(): void {
    this.filtersOpen.update(v => !v);
  }

  onDateRangeChange(range: { start: Date | null; end: Date | null }): void {
    this.dateFrom = range.start;
    this.dateTo = range.end;
  }

  applyFilters(): void {
    const format = (d: Date | null) =>
      d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';

    this.filterChange.emit({
      page: 1,
      pageSize: 20,
      search: this.search,
      statusId: this.statusId,
      sourceId: this.sourceId,
      assignedUserId: this.assignedUserId,
      dateFrom: format(this.dateFrom),
      dateTo: format(this.dateTo),
    });
  }

  clearFilters(): void {
    this.search = '';
    this.statusId = '';
    this.sourceId = '';
    this.assignedUserId = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.applyFilters();
  }
}
