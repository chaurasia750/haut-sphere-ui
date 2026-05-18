import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule],
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
    this.onFilter();
  }
}
