import { Component } from '@angular/core';
import { LeadsListComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-list-page',
  standalone: true,
  imports: [LeadsListComponent],
  template: `<lib-leads-list />`,
})
export class AdminLeadsListPageComponent {}
