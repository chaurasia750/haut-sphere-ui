import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { BreadcrumbItem } from '@shared/ui/src';
import { MembersService } from '@shared/members/src';
import { Member } from '@shared/members/src';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  private readonly membersService = inject(MembersService);
  private readonly cdr = inject(ChangeDetectorRef);

  title = 'Admin Dashboard';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard' },
  ];
  stats = [
    { label: 'Total Users', value: '1,234' },
    { label: 'Active Sessions', value: '156' },
    { label: 'System Health', value: '99.8%' },
  ];

  inactiveMembers: Member[] = [];
  loadingInactive = false;
  activatingId: number | null = null;
  confirmOpen = false;
  pendingActivateId: number | null = null;

  ngOnInit(): void {
    this.loadInactiveMembers();
  }

  private loadInactiveMembers(): void {
    this.loadingInactive = true;
    this.membersService.getMembers({ Status: 0, PageSize: 10, PageIndex: 1 }).subscribe({
      next: (res) => {
        this.inactiveMembers = res.items;
        this.loadingInactive = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.inactiveMembers = [];
        this.loadingInactive = false;
        this.cdr.detectChanges();
      },
    });
  }

  onActivate(id: number): void {
    this.pendingActivateId = id;
    this.confirmOpen = true;
  }

  onConfirmActivate(): void {
    const id = this.pendingActivateId;
    if (id === null) return;

    this.confirmOpen = false;
    this.activatingId = id;
    this.membersService.activateMember(id).subscribe({
      next: () => {
        this.inactiveMembers = this.inactiveMembers.filter(m => m.id !== id);
        this.activatingId = null;
        this.pendingActivateId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.activatingId = null;
        this.pendingActivateId = null;
        this.cdr.detectChanges();
      },
    });
  }

  onCancelActivate(): void {
    this.confirmOpen = false;
    this.pendingActivateId = null;
  }

  initials(name: string): string {
    if (!name) return '--';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
}
