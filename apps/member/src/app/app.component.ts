import { Component } from '@angular/core';
import { AppLayoutConfig } from '@shared';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `<shared-app-layout [config]="layoutConfig"></shared-app-layout>`,
})
export class AppComponent {
  readonly layoutConfig: AppLayoutConfig = {
    appName: 'Member Portal',
    brandName: 'BitScholar',
    appSubtitle: 'Personal Workspace',
    footerText: 'Member Module',
    user: {
      name: 'Mr. Bit Scholars',
      role: 'Member',
    },
    notifications: [
      { id: 1, title: 'Upgrade request approved', time: 'Just now', read: false },
      { id: 2, title: 'KYC document verified', time: '20m ago', read: false },
      { id: 3, title: 'Welcome to the dashboard', time: 'Yesterday', read: true },
    ],
    menu: [
      { label: 'Profile', route: '/profile', icon: 'P' },
      { label: 'Account', route: '/profile', icon: 'A' },
      { label: 'Preferences', route: '/profile', icon: 'PR' },
    ],
  };
}
