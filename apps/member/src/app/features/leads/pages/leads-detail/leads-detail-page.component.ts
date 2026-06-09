import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadsDetailComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-detail',
  standalone: true,
  imports: [LeadsDetailComponent],
  template: `<lib-leads-detail appPrefix="member" [leadId]="leadId"/>`,
})
export class MemberLeadsDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly leadId = Number(this.route.snapshot.params['id']);
}
