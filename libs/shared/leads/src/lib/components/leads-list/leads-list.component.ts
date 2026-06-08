import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../../services/leads.service';
import { USERS_SERVICE } from '../../services/users.service';
import { Lead } from '../../models/lead.model';
import { LeadLookupItem } from '../../models/lead-api.model';
import { User } from '../../models/user.model';
import { UiBreadcrumbComponent, BreadcrumbItem, UiPaginationComponent } from '@shared/ui/src';
import { LeadFilters } from '../leads-filters/leads-filters.component';
import { LeadsFiltersComponent } from '../leads-filters/leads-filters.component';
import { LeadsTableComponent } from '../leads-table/leads-table.component';

@Component({
  selector: 'lib-leads-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBreadcrumbComponent, UiPaginationComponent, LeadsFiltersComponent, LeadsTableComponent],
  templateUrl: './leads-list.component.html',
})
export class LeadsListComponent implements OnInit {
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'CRM' },
    { label: 'All Leads' },
  ];
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly leadsService = inject(LeadsService);
  private readonly usersService = inject(USERS_SERVICE);

  leads: Lead[] = [];
  users: User[] = [];
  statuses: LeadLookupItem[] = [];

  pageIndex = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  currentFilters: LeadFilters = {
    page: 1,
    pageSize: 20,
    search: '',
    statusId: '',
    assignedUserId: '',
    fromDate: '',
    toDate: '',
    followupFromDate: '',
    followupToDate: '',
  };

  ngOnInit(): void {
    this.loadLeads();

    this.usersService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: () => this.users = [],
    });

    this.leadsService.getLeadStatusLookup().subscribe({
      next: (data) => this.statuses = data,
      error: () => this.statuses = [],
    });
  }

  private loadLeads(): void {
    const params = {
      page: this.currentFilters.page,
      pageSize: this.currentFilters.pageSize,
      search: this.currentFilters.search || undefined,
      statusId: this.currentFilters.statusId ? +this.currentFilters.statusId : undefined,
      assignedUserId: this.currentFilters.assignedUserId ? +this.currentFilters.assignedUserId : undefined,
      fromDate: this.currentFilters.fromDate || undefined,
      toDate: this.currentFilters.toDate || undefined,
      followupFromDate: this.currentFilters.followupFromDate || undefined,
      followupToDate: this.currentFilters.followupToDate || undefined,
    };

    this.leadsService.getLeads(params).subscribe({
      next: (res) => {
        this.leads = res.items;
        this.pageIndex = res.page;
        this.pageSize = res.pageSize;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load leads:', err);
      },
    });
  }

  onFilterChange(filters: LeadFilters): void {
    this.currentFilters = filters;
    this.loadLeads();
  }

  onPageChange(page: number): void {
    this.currentFilters = { ...this.currentFilters, page };
    this.loadLeads();
  }

  onEditLead(lead: Lead): void {
    console.log('Edit lead:', lead.id);
  }
}
