import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';

@Component({
  selector: 'lib-lead-header',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBreadcrumbComponent],
  templateUrl: './lead-header.component.html',
})
export class LeadHeaderComponent {
  @Output() addLead = new EventEmitter<void>();

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'CRM' },
    { label: 'Leads', link: '/leads' },
    { label: 'Dashboard' },
  ];

  assignedUsers = ['All Users', 'Anita Sharma', 'Vikram Patel', 'Neha Gupta', 'Rajesh Kumar'];
  selectedUser = 'All Users';
  dateRange = 'Last 30 Days';
}
