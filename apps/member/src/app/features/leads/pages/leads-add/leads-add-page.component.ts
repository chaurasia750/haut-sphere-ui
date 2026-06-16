import { Component } from '@angular/core';
import { LeadsAddLeadComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-add',
  standalone: true,
  imports: [LeadsAddLeadComponent],
  template: `<lib-leads-add-lead appPrefix="member" />`,
})
export class MemberLeadsAddPageComponent {}
