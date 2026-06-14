import { Component } from '@angular/core';
import { MemberListComponent } from '@shared/members/src';

@Component({
  selector: 'app-member-members-list-page',
  standalone: true,
  imports: [MemberListComponent],
  template: `<lib-member-list />`,
})
export class MemberMembersListPageComponent {}
