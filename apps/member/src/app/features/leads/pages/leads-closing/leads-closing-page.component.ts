import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadsClosingComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-closing-page',
  standalone: true,
  imports: [LeadsClosingComponent],
  template: `<lib-leads-closing appPrefix="member" [leadId]="leadId"/>`,
})
export class MemberLeadsClosingPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly leadId = Number(this.route.snapshot.params['id']);
}
