import { Component } from '@angular/core';
import { LeadsFormComponent } from '@shared/leads/src';

@Component({
  selector: 'app-admin-leads-add-page',
  standalone: true,
  imports: [LeadsFormComponent],
  template: `<lib-leads-form />`,
})
export class AdminLeadsAddPageComponent {}
