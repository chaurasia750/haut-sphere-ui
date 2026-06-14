import { Component } from '@angular/core';
import { BreadcrumbItem } from '@shared/ui/src';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  title = 'Admin Dashboard';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard' },
  ];
  stats = [
    { label: 'Total Users', value: '1,234' },
    { label: 'Active Sessions', value: '156' },
    { label: 'System Health', value: '99.8%' },
  ];
}
