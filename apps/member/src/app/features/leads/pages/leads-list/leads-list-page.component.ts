import { Component } from '@angular/core';
import { LeadsListComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-list',
  standalone: true,
  imports: [LeadsListComponent],
  template: `<lib-leads-list />`,
})
export class MemberLeadsListPageComponent {}
