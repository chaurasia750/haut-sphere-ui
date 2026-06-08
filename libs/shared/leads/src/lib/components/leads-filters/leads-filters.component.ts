import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedDatePickerComponent } from '@shared/ui/src';
import { SharedUserSelectComponent } from '../shared-user-select/shared-user-select.component';
import { SharedLeadStatusSelectComponent } from '../shared-lead-status-select/shared-lead-status-select.component';

export interface LeadFilters {
  search: string;
  statusId: number | string;
  assignedUserId: number | string;
  followupDate: string;
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
  followupDate = '';
  followupDateValue: Date | null = null;

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  onFilter(): void {
    this.filterChange.emit({
      search: this.search,
      statusId: this.statusId,
      assignedUserId: this.assignedUserId,
      followupDate: this.followupDate,
    });
  }

  clearFilters(): void {
    this.search = '';
    this.statusId = '';
    this.assignedUserId = '';
    this.followupDate = '';
    this.followupDateValue = null;
    this.onFilter();
  }

  onFollowupDateChange(date: Date | null): void {
    this.followupDateValue = date;
    this.followupDate = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';
    this.onFilter();
  }
}
