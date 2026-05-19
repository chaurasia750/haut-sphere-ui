import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedDatePickerComponent } from '@shared/ui/src';
import { Lead } from '../../models/lead.model';

export interface LeadFilters {
  search: string;
  status: string;
  assignedUser: string;
  city: string;
  followupDate: string;
}

@Component({
  selector: 'lib-leads-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedDatePickerComponent],
  templateUrl: './leads-filters.component.html',
})
export class LeadsFiltersComponent {
  @Input({ required: true }) allLeads: Lead[] = [];
  @Output() filterChange = new EventEmitter<LeadFilters>();

  search = '';
  status = '';
  assignedUser = '';
  city = '';
  followupDate = '';
  followupDateValue: Date | null = null;

  get users(): string[] {
    return [...new Set(this.allLeads.map(l => l.assignedUser))];
  }

  get cities(): string[] {
    return [...new Set(this.allLeads.map(l => l.city))];
  }

  onFilter(): void {
    this.filterChange.emit({
      search: this.search,
      status: this.status,
      assignedUser: this.assignedUser,
      city: this.city,
      followupDate: this.followupDate,
    });
  }

  clearFilters(): void {
    this.search = '';
    this.status = '';
    this.assignedUser = '';
    this.city = '';
    this.followupDate = '';
    this.followupDateValue = null;
    this.onFilter();
  }

  onFollowupDateChange(date: Date | null): void {
    this.followupDateValue = date;
    this.followupDate = date ? this.formatDate(date) : '';
    this.onFilter();
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
