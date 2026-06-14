import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { UiPaginationComponent, UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';
import { MembersService } from '../../services/members.service';
import { GetMembersRequest } from '../../models/member-api.model';
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
  ],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent implements OnInit {
  private readonly membersService = inject(MembersService);

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
}
