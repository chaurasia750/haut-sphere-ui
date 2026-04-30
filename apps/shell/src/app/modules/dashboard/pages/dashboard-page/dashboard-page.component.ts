import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  title = 'Shell Dashboard';
  message = 'Welcome to the Haut Spare UI dashboard. Navigate to Admin, Member, or Management sections using the sidebar.';
}
