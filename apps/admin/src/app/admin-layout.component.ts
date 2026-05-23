import { Component } from '@angular/core';
import { AppLayoutConfig } from '@shared';
import { DASHBOARD_ICON, INVENTORY_ICON, LEADS_ICON, TREE_ICON, USERS_ICON } from './menu-icons';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  template: `<shared-app-layout [config]="layoutConfig"></shared-app-layout>`,
})
export class AdminLayoutComponent {
  readonly layoutConfig: AppLayoutConfig = {
    appName: 'Admin Portal',
    brandName: 'Anon India',
    appSubtitle: 'Administration Console',

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
      { label: 'Dashboard', route: '/admin/dashboard', section: 'MAIN', icon: DASHBOARD_ICON },
      { label: 'Inventory', section: 'MAIN', icon: INVENTORY_ICON, subItems: [
        { name: 'All Inventory', path: '/admin/inventory/list' },
        { name: 'Add Inventory', path: '/admin/inventory/add-inventory' },
      ]},
      { label: 'Leads', section: 'MAIN', icon: LEADS_ICON, subItems: [
        { name: 'Dashboard', path: '/admin/leads' },
        { name: 'List', path: '/admin/leads/list' },
        { name: 'Add Lead', path: '/admin/leads/add' },
      ]},
      { label: 'Tree', route: '/admin/tree', section: 'MANAGEMENT', icon: TREE_ICON },
      { label: 'Users', route: '/admin/users', section: 'MANAGEMENT', icon: USERS_ICON },
    ],
  };
}
