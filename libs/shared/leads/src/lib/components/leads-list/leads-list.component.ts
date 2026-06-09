import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LeadsService } from '../../services/leads.service';
import { USERS_SERVICE } from '../../services/users.service';
import { Lead } from '../../models/lead.model';
import { LeadLookupItem, CreateActivityRequest, ActivityType, FollowUpItem } from '../../models/lead-api.model';
import { User } from '../../models/user.model';
import { UiBreadcrumbComponent, BreadcrumbItem, UiPaginationComponent, SharedSidePanelComponent, SharedDatePickerComponent } from '@shared/ui/src';
import { LeadFilters } from '../leads-filters/leads-filters.component';
import { LeadsFiltersComponent } from '../leads-filters/leads-filters.component';
import { LeadsTableComponent } from '../leads-table/leads-table.component';

const ACTIVITY_TYPES: ActivityType[] = [
  { id: 1, name: 'Call', icon: 'phone', color: '#4CAF50' },
  { id: 2, name: 'Site Visit', icon: 'location', color: '#FF9800' },
  { id: 3, name: 'Meeting', icon: 'users', color: '#CC5DE8' },
  { id: 4, name: 'Email', icon: 'mail', color: '#339AF0' },
  { id: 5, name: 'Other', icon: 'more-horizontal', color: '#868E96' },
];

@Component({
  selector: 'lib-leads-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBreadcrumbComponent, UiPaginationComponent, LeadsFiltersComponent, LeadsTableComponent, SharedSidePanelComponent, SharedDatePickerComponent],
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

  activityTypes = ACTIVITY_TYPES;
  followUpPanelOpen = false;
  followUpLead: Lead | null = null;
  followUpSubmitting = false;
  followUpHistory: FollowUpItem[] = [];
  followUpHistoryLoading = false;
  followUpHistoryExpanded = true;
  followUpFormExpanded = true;
  followUpForm = {
    activityTypeId: 1,
    subject: '',
    description: '',
    activityDate: new Date(),
    nextFollowupDate: null as Date | null,
    durationMinutes: 15,
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
    this.followUpLead = lead;
    this.followUpForm = {
      activityTypeId: 1,
      subject: 'Follow-up: ' + lead.name,
      description: '',
      activityDate: new Date(),
      nextFollowupDate: null,
      durationMinutes: 15,
    };
    this.followUpPanelOpen = true;
    this.loadFollowUpHistory(lead.id);
  }

  private loadFollowUpHistory(leadId: number): void {
    this.followUpHistoryLoading = true;
    this.followUpHistory = [];
    this.leadsService.getFollowUps({ LeadId: leadId, PageSize: 50 }).subscribe({
      next: (res) => {
        this.followUpHistory = res.items;
        this.followUpHistoryLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.followUpHistoryLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getActivityColor(type: string): string {
    const t = this.activityTypes.find(at => at.name === type);
    return t ? t.color : '#868E96';
  }

  onActivityDateChange(date: Date | null): void {
    this.followUpForm.activityDate = date ?? new Date();
  }

  submitFollowUp(): void {
    if (!this.followUpLead || !this.followUpForm.subject.trim()) return;
    this.followUpSubmitting = true;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const payload: CreateActivityRequest = {
      activityTypeId: this.followUpForm.activityTypeId,
      subject: this.followUpForm.subject.trim(),
      description: this.followUpForm.description.trim(),
      activityDate: fmt(this.followUpForm.activityDate),
      nextFollowupDate: this.followUpForm.nextFollowupDate ? fmt(this.followUpForm.nextFollowupDate) : undefined,
      durationMinutes: this.followUpForm.durationMinutes,
    };

    this.leadsService.createActivity(this.followUpLead.id, payload).pipe(
      finalize(() => {
        this.followUpSubmitting = false;
      })
    ).subscribe({
      next: () => {
        this.followUpPanelOpen = false;
        this.followUpLead = null;
      },
    });
  }
}
