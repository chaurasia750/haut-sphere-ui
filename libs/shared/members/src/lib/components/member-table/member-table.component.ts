import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Member } from '../../models/member.model';

@Component({
  selector: 'lib-member-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-table.component.html',
})
export class MemberTableComponent {
  readonly members = input<Member[]>([]);
  readonly loading = input(false);

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
