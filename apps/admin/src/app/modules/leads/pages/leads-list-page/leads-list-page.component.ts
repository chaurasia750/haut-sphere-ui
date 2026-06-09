import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsListComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-list-page',
  standalone: true,
  imports: [LeadsListComponent],
  template: `<lib-leads-list (addLead)="onAddLead()" />`,
})
export class AdminLeadsListPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  onAddLead(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
