import { Component } from '@angular/core';
import { LeadsFormComponent } from '@shared/leads/src';

@Component({
  selector: 'app-member-leads-add',
  standalone: true,
  imports: [LeadsFormComponent],
  template: `<lib-leads-form />`,
})
export class MemberLeadsAddPageComponent {}
