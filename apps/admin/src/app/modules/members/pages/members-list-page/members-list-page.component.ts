import { Component } from '@angular/core';
import { MemberListComponent } from '@shared/members/src';

@Component({
  selector: 'app-admin-members-list-page',
  standalone: true,
  imports: [MemberListComponent],
  template: `<lib-member-list [isAdmin]="true" />`,
})
export class AdminMembersListPageComponent {}
