import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsListComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-list-page',
  standalone: true,
  imports: [LeadsListComponent],
  template: `<lib-leads-list appPrefix="admin" (addLead)="onAddLead()" (viewLead)="onViewLead($event)" (closing)="onClosing($event)" />`,
})
export class AdminLeadsListPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  onAddLead(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  onViewLead(id: number): void {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  onClosing(id: number): void {
    this.router.navigate(['../', id, 'closing'], { relativeTo: this.route });
  }
}
