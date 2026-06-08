import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LeadsService } from '../../services/leads.service';
import { USERS_SERVICE } from '../../services/users.service';
import { Lead } from '../../models/lead.model';
import { LeadLookupItem } from '../../models/lead-api.model';
import { User } from '../../models/user.model';
import { UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';
import { LeadFilters } from '../leads-filters/leads-filters.component';
import { LeadsFiltersComponent } from '../leads-filters/leads-filters.component';
import { LeadsTableComponent } from '../leads-table/leads-table.component';

@Component({
  selector: 'lib-leads-list',
  standalone: true,
  imports: [CommonModule, UiBreadcrumbComponent, LeadsFiltersComponent, LeadsTableComponent],
  templateUrl: './leads-list.component.html',
})
export class LeadsListComponent implements OnInit {
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'CRM' },
    { label: 'All Leads' },
  ];
  private readonly leadsService = inject(LeadsService);
  private readonly usersService = inject(USERS_SERVICE);

  allLeads: Lead[] = [];
  filteredLeads: Lead[] = [];
  users: User[] = [];
  statuses: LeadLookupItem[] = [];

  ngOnInit(): void {
    this.leadsService.getLeads().subscribe(d => {
      this.allLeads = d;
      this.filteredLeads = [...d];
    });

    this.usersService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: () => this.users = [],
    });

    this.leadsService.getLeadStatusLookup().subscribe({
      next: (data) => this.statuses = data,
      error: () => this.statuses = [],
    });
  }

  onFilterChange(filters: LeadFilters): void {
    let result = [...this.allLeads];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) || l.mobile.includes(q)
      );
    }

    if (filters.statusId) {
      const statusName = this.statuses.find(s => s.id === +filters.statusId)?.name?.toLowerCase() || '';
      if (statusName) {
        result = result.filter(l => l.status.toLowerCase() === statusName);
      }
    }

    if (filters.assignedUserId) {
      const userName = this.users.find(u => u.id === +filters.assignedUserId)?.fullName || '';
      if (userName) {
        result = result.filter(l => l.assignedUser === userName);
      }
    }

    if (filters.followupDate) {
      result = result.filter(l =>
        l.followupDate.toLowerCase().includes(filters.followupDate.toLowerCase())
      );
    }

    this.filteredLeads = result;
  }

  onEditLead(lead: Lead): void {
    console.log('Edit lead:', lead.id);
  }
}
