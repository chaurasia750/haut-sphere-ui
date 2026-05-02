import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './user-meta-card.component.html',
})
export class UserMetaCardComponent {
  // Example user data (could be made dynamic)
  user = {
    firstName: 'Mr.',
    lastName: 'BIT SCHOLARS',
    role: 'Member',
    location: 'Amalner (Jalgaon) MAHARASHTRA, India',
    avatar: '/images/profile/profile.jpg',
    social: {
      facebook: 'https://www.facebook.com/',
      x: 'https://x.com/',
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://instagram.com/',
    },
    email: 'pcei98@gmail.com',
    phone: '+91-9270848764',
    bio: 'Member',
  };
}
