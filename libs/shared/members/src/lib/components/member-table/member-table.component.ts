import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
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
  readonly isAdmin = input(false);
  readonly action = output<{ member: Member; action: 'activate' | 'deactivate' }>();
  readonly rowView = output<Member>();

  readonly activatingId = input<number | null>(null);

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
