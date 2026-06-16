import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsListComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-list',
  standalone: true,
  imports: [LeadsListComponent],
  template: `<lib-leads-list appPrefix="member" addButtonText="Add Customer" [showAssignUser]="false" (addLead)="onAddLead()" (viewLead)="onViewLead($event)" (closing)="onClosing($event)" />`,
})
export class MemberLeadsListPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  onAddLead(): void {
    this.router.navigate(['../customers-add'], { relativeTo: this.route });
  }

  onViewLead(id: number): void {
    this.router.navigate(['../customers-detail', id], { relativeTo: this.route });
  }

  onClosing(id: number): void {
    this.router.navigate(['../customers-closing', id], { relativeTo: this.route });
  }
}
