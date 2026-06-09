import { Component } from '@angular/core';
import { LeadsAddLeadComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-add-page',
  standalone: true,
  imports: [LeadsAddLeadComponent],
  template: `<lib-leads-add-lead appPrefix="admin" />`,
})
export class AdminLeadsAddPageComponent {}
