import { Component } from '@angular/core';

@Component({
  selector: 'app-users-page',
  standalone: false,
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export class UsersPageComponent {
  title = 'User Management';
}
