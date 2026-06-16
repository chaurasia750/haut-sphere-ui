import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from '@shared/members/src';
import { UiPaginationComponent } from '@shared/ui/src';

@Component({
  selector: 'app-sponsor-members',
  imports: [CommonModule, UiPaginationComponent],
  templateUrl: './sponsor-members.component.html',
})
export class SponsorMembersComponent implements OnInit {
  members: any[] = [];
  currentPage = 1;
  readonly itemsPerPage = 5;
  loading = true;
  errorMessage = '';
  private readonly membersService = inject(MembersService);
  private readonly cdr = inject(ChangeDetectorRef);

  get currentItems(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.members.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.members.length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.membersService.getMembers({ PageIndex: 1, PageSize: 10 }).subscribe({
      next: (res: any) => {
        const unwrapped = res?.data ?? res;
        this.members = unwrapped?.items ?? (Array.isArray(unwrapped) ? unwrapped : []);
        this.currentPage = 1;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = `Failed to load: ${err.status ?? 'network error'}`;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}