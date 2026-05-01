import { Component } from '@angular/core';
import { AppLayoutConfig } from '@shared';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `<shared-app-layout [config]="layoutConfig"></shared-app-layout>`,
})
export class AppComponent {
  readonly layoutConfig: AppLayoutConfig = {
    appName: 'Management Portal',
    brandName: 'BitScholar',
    appSubtitle: 'Operations Workspace',
    footerText: 'Management Module',
    user: {
      name: 'Manager User',
      role: 'Manager',
    },
    notifications: [
      { id: 1, title: 'Operations KPI updated', time: '8m ago', read: false },
      { id: 2, title: 'Inventory sync completed', time: '42m ago', read: false },
      { id: 3, title: 'Team assignment changed', time: 'Today', read: true },
    ],
    menu: [
      { label: 'Overview', route: '/overview', icon: 'O' },
      {
        label: 'Operations',
        icon: 'OP',
        subItems: [
          { name: 'Task Board', path: '/overview' },
          { name: 'Workflow Status', path: '/overview' },
        ],
      },
      {
        label: 'Reports',
        icon: 'RP',
        subItems: [
          { name: 'Daily Summary', path: '/overview' },
          { name: 'Performance Trends', path: '/overview' },
        ],
      },
    ],
  };
}
