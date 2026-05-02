import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppLayoutConfig } from '@shared';
import { SharedTranslationService } from '@shared';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `<shared-app-layout [config]="layoutConfig"></shared-app-layout>`,
})
export class AppComponent implements OnInit {
  readonly layoutConfig: AppLayoutConfig = {
    appName: 'Admin Portal',
    brandName: 'Anon India',
    appSubtitle: 'Administration Console',
    footerText: 'Admin Module',
    user: {
      name: 'Admin User',
      role: 'Administrator',
    },
    notifications: [
      { id: 1, title: 'New member registration pending approval', time: '5m ago', read: false },
      { id: 2, title: 'Daily audit report generated', time: '30m ago', read: false },
      { id: 3, title: 'Role permissions updated', time: 'Yesterday', read: true },
    ],
    menu: [
      { label: 'Dashboard', route: '/dashboard', icon: 'D' },
      {
        label: 'User Management',
        icon: 'UM',
        subItems: [
          { name: 'All Users', path: '/dashboard' },
          { name: 'Pending Approvals', path: '/dashboard' },
        ],
      },
      {
        label: 'System Controls',
        icon: 'SC',
        subItems: [
          { name: 'Roles & Permissions', path: '/dashboard' },
          { name: 'Audit Logs', path: '/dashboard' },
        ],
      },
    ],
  };

  constructor(
    private readonly title: Title,
    private readonly i18n: SharedTranslationService
  ) {}

  ngOnInit(): void {
    this.i18n.setDocumentTitle(this.title, 'app.title', 'Anon India');
  }
}
