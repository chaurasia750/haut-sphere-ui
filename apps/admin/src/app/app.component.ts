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
      { label: 'Dashboard', route: '/dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
      { label: 'Users', route: '/users', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
      { label: 'Projects', route: '/projects', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
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
