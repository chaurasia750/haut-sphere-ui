import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadsDetailComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-detail-page',
  standalone: true,
  imports: [LeadsDetailComponent],
  template: `<lib-leads-detail appPrefix="admin" [leadId]="leadId"/>`,
})
export class AdminLeadsDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly leadId = Number(this.route.snapshot.params['id']);
}
