import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedDatePickerComponent } from '@shared/ui/src';
import { SharedUserSelectComponent } from '../shared-user-select/shared-user-select.component';
import { SharedLeadStatusSelectComponent } from '../shared-lead-status-select/shared-lead-status-select.component';

export interface LeadFilters {
  page: number;
  pageSize: number;
  search: string;
  statusId: number | string;
  assignedUserId: number | string;
  fromDate: string;
  toDate: string;
  followupFromDate: string;
  followupToDate: string;
}

@Component({
  selector: 'lib-leads-filters',
  standalone: true,
  imports: [
    CommonModule, FormsModule, SharedDatePickerComponent,
    SharedUserSelectComponent, SharedLeadStatusSelectComponent,
  ],
  templateUrl: './leads-filters.component.html',
})
export class LeadsFiltersComponent {
  @Output() filterChange = new EventEmitter<LeadFilters>();

  readonly isOpen = signal(true);

  search = '';
  statusId: number | string = '';
  assignedUserId: number | string = '';
  fromDate = '';
  toDate = '';
  followupFromDate = '';
  followupToDate = '';
  fromDateValue: Date | null = null;
  toDateValue: Date | null = null;
  followupFromDateValue: Date | null = null;
  followupToDateValue: Date | null = null;

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  formatDate(date: Date | null): string {
    return date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';
  }

  onFilter(): void {
    this.filterChange.emit({
      page: 1,
      pageSize: 20,
      search: this.search,
      statusId: this.statusId,
      assignedUserId: this.assignedUserId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      followupFromDate: this.followupFromDate,
      followupToDate: this.followupToDate,
    });
  }

  clearFilters(): void {
    this.search = '';
    this.statusId = '';
    this.assignedUserId = '';
    this.fromDate = '';
    this.toDate = '';
    this.followupFromDate = '';
    this.followupToDate = '';
    this.fromDateValue = null;
    this.toDateValue = null;
    this.followupFromDateValue = null;
    this.followupToDateValue = null;
    this.onFilter();
  }
}
