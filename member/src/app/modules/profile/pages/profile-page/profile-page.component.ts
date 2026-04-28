import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15',
    role: 'Member',
  };

  preferences = {
    emailNotifications: true,
    twoFactorEnabled: false,
    newsletter: true,
  };
}
