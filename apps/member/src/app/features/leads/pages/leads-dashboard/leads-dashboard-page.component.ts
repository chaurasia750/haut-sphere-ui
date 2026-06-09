import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LeadsDashboardComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-dashboard',
  standalone: true,
  imports: [LeadsDashboardComponent],
  template: `<lib-leads-dashboard appPrefix="member" (viewList)="onViewList()"/>`,
})
export class MemberLeadsDashboardPageComponent {
  constructor(private readonly router: Router) {}

  onViewList(): void {
    this.router.navigate(['/member/leads-list']);
  }
}
