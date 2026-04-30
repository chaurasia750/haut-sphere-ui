import { Component } from '@angular/core';

@Component({
  selector: 'app-overview-page',
  standalone: false,
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
})
export class OverviewPageComponent {
  metrics = [
    { label: 'Uptime', value: '99.99%', status: 'healthy' },
    { label: 'Response Time', value: '124ms', status: 'healthy' },
    { label: 'Active Users', value: '2,845', status: 'healthy' },
    { label: 'Errors (24h)', value: '12', status: 'warning' },
  ];

  services = [
    { name: 'Auth Service', status: 'online' },
    { name: 'API Gateway', status: 'online' },
    { name: 'Database', status: 'online' },
    { name: 'Cache Layer', status: 'online' },
  ];
}
