import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { UiPaginationComponent, UiBreadcrumbComponent, BreadcrumbItem, ConfirmDialogComponent, SharedSidePanelComponent } from '@shared/ui/src';
import { MembersService } from '../../services/members.service';
import { GetMembersRequest, MemberLoginDetails } from '../../models/member-api.model';
import { Member } from '../../models/member.model';
import { MemberFiltersComponent } from '../member-filters/member-filters.component';
import { MemberTableComponent } from '../member-table/member-table.component';

@Component({
  selector: 'lib-member-list',
  standalone: true,
  imports: [
    CommonModule,
    UiPaginationComponent,
    UiBreadcrumbComponent,
    MemberFiltersComponent,
    MemberTableComponent,
    ConfirmDialogComponent,
    SharedSidePanelComponent,
  ],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent implements OnInit {
  private readonly membersService = inject(MembersService);

  readonly isAdmin = input(false);

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Members' },
    { label: 'All Members' },
  ];

  readonly members = signal<Member[]>([]);
  readonly loading = signal(false);
  readonly pageIndex = signal(1);
  readonly pageSize = signal(25);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly activatingId = signal<number | null>(null);
  readonly confirmOpen = signal(false);
  readonly pendingAction = signal<{ member: Member; action: 'activate' | 'deactivate' } | null>(null);

  readonly panelOpen = signal(false);
  readonly selectedMember = signal<Member | null>(null);
  readonly loginDetails = signal<MemberLoginDetails | null>(null);
  readonly loginLoading = signal(false);
  readonly showPassword = signal<Record<number, boolean>>({});

  private keyword = '';
  private status: number | null = null;

  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.loadMembers();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.pageIndex.set(1);
      this.loadMembers();
    });
  }

  private loadMembers(): void {
    this.loading.set(true);

    const params: GetMembersRequest = {
      Keyword: this.keyword || undefined,
      Status: this.status !== null ? this.status : undefined,
      PageIndex: this.pageIndex(),
      PageSize: this.pageSize(),
    };

    this.membersService.getMembers(params).subscribe({
      next: (res) => {
        this.members.set(res.items);
        this.pageIndex.set(res.pageIndex);
        this.pageSize.set(res.pageSize);
        this.totalCount.set(res.totalCount);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.members.set([]);
        this.loading.set(false);
      },
    });
  }

  onKeywordChange(value: string): void {
    this.keyword = value;
    this.searchSubject.next(value);
  }

  onStatusChange(value: number | null): void {
    this.status = value;
    this.pageIndex.set(1);
    this.loadMembers();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadMembers();
  }

  onMemberAction(data: { member: Member; action: 'activate' | 'deactivate' }): void {
    this.pendingAction.set(data);
    this.confirmOpen.set(true);
  }

  onConfirmAction(): void {
    const data = this.pendingAction();
    if (!data) return;

    this.confirmOpen.set(false);
    this.activatingId.set(data.member.id);

    const request$ = data.action === 'activate'
      ? this.membersService.activateMember(data.member.id)
      : this.membersService.deactivateMember(data.member.id);

    request$.subscribe({
      next: () => {
        this.activatingId.set(null);
        this.pendingAction.set(null);
        this.loadMembers();
      },
      error: () => {
        this.activatingId.set(null);
        this.pendingAction.set(null);
      },
    });
  }

  onCancelAction(): void {
    this.confirmOpen.set(false);
    this.pendingAction.set(null);
  }

  onViewMember(member: Member): void {
    this.selectedMember.set(member);
    this.panelOpen.set(true);
    this.loginLoading.set(true);
    this.loginDetails.set(null);

    this.membersService.getMemberLoginDetails(member.id).subscribe({
      next: (details) => {
        this.loginDetails.set(details);
        this.loginLoading.set(false);
      },
      error: () => {
        this.loginDetails.set(null);
        this.loginLoading.set(false);
      },
    });
  }

  onClosePanel(): void {
    this.panelOpen.set(false);
    this.selectedMember.set(null);
    this.loginDetails.set(null);
    this.showPassword.set({});
  }

  togglePassword(id: number): void {
    this.showPassword.update(v => ({ ...v, [id]: !v[id] }));
  }
}
