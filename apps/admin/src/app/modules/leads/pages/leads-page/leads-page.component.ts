import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LeadsDashboardComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-page',
  standalone: true,
  imports: [LeadsDashboardComponent],
  template: `<lib-leads-dashboard appPrefix="admin" (addLead)="onAddLead()" (viewList)="onViewList()"/>`,
})
export class AdminLeadsPageComponent {
  constructor(private readonly router: Router) {}

  onViewList(): void {
    this.router.navigate(['/admin/leads/list']);
  }

  onAddLead(): void {
    this.router.navigate(['/admin/leads/add']);
  }
}
