import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../../services/leads.service';
import { USERS_SERVICE } from '../../services/users.service';
import { Lead } from '../../models/lead.model';
import { LeadLookupItem, LeadDetail } from '../../models/lead-api.model';
import { User } from '../../models/user.model';
import { UiBreadcrumbComponent, BreadcrumbItem, UiPaginationComponent, ConfirmDialogComponent, UiButtonComponent } from '@shared/ui/src';
import { LeadFilters } from '../leads-filters/leads-filters.component';
import { LeadsFiltersComponent } from '../leads-filters/leads-filters.component';
import { LeadsTableComponent } from '../leads-table/leads-table.component';
import { LeadsFollowupComponent } from '../leads-followup/leads-followup.component';
import { SharedUserSelectComponent } from '../shared-user-select/shared-user-select.component';

@Component({
  selector: 'lib-leads-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBreadcrumbComponent, UiPaginationComponent, LeadsFiltersComponent, LeadsTableComponent, LeadsFollowupComponent, SharedUserSelectComponent, ConfirmDialogComponent, UiButtonComponent],
  templateUrl: './leads-list.component.html',
})
export class LeadsListComponent implements OnInit {
  @Output() addLead = new EventEmitter<void>();
  @Output() viewLead = new EventEmitter<number>();

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'CRM' },
    { label: 'All Leads' },
  ];
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly leadsService = inject(LeadsService);
  private readonly usersService = inject(USERS_SERVICE);

  selectedIds = new Set<number>();
  allSelected = false;
  bulkAssigning = false;
  selectedUserId: number | null = null;
  showConfirmModal = false;
  pendingUserId: number | null = null;
  get showBulkBar(): boolean { return this.selectedIds.size > 0; }
  get selectedLeads(): Lead[] { return this.leads.filter(l => this.selectedIds.has(l.id)); }
  get pendingUser(): User | undefined { return this.users.find(u => u.id === this.pendingUserId); }

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
    sourceId: '',
    assignedUserId: '',
    dateFrom: '',
    dateTo: '',
  };

  followUpLead: LeadDetail | null = null;

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
      sourceId: this.currentFilters.sourceId ? +this.currentFilters.sourceId : undefined,
      assignedUserId: this.currentFilters.assignedUserId ? +this.currentFilters.assignedUserId : undefined,
      fromDate: this.currentFilters.dateFrom || undefined,
      toDate: this.currentFilters.dateTo || undefined,
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
    this.viewLead.emit(lead.id);
  }

  onFollowUp(lead: Lead): void {
    this.followUpLead = lead as unknown as LeadDetail;
  }

  onSelectionChange(event: { leadId: number; checked: boolean }): void {
    if (event.checked) {
      this.selectedIds.add(event.leadId);
    } else {
      this.selectedIds.delete(event.leadId);
    }
    this.selectedIds = new Set(this.selectedIds);
    this.allSelected = this.leads.length > 0 && this.leads.every(l => this.selectedIds.has(l.id));
  }

  clearSelection(): void {
    this.selectedIds = new Set();
    this.allSelected = false;
    this.selectedUserId = null;
  }

  onToggleAll(): void {
    if (this.allSelected) {
      this.selectedIds = new Set();
      this.allSelected = false;
    } else {
      this.selectedIds = new Set(this.leads.map(l => l.id));
      this.allSelected = true;
    }
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  openConfirmModal(): void {
    if (!this.selectedUserId || this.selectedIds.size === 0) return;
    this.pendingUserId = this.selectedUserId;
    this.showConfirmModal = true;
  }

  cancelAssign(): void {
    this.showConfirmModal = false;
    this.pendingUserId = null;
  }

  confirmAssign(): void {
    if (!this.pendingUserId) return;
    this.showConfirmModal = false;
    this.bulkAssigning = true;
    this.leadsService.bulkAssignLead({
      leadIds: Array.from(this.selectedIds),
      assignedUserId: this.pendingUserId,
    }).subscribe({
      next: () => {
        this.clearSelection();
        this.loadLeads();
        this.bulkAssigning = false;
      },
      error: () => {
        this.bulkAssigning = false;
      },
    });
  }
}
