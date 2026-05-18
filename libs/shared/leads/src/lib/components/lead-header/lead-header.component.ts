import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-lead-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-header.component.html',
})
export class LeadHeaderComponent {
  @Output() addLead = new EventEmitter<void>();

  assignedUsers = ['All Users', 'Anita Sharma', 'Vikram Patel', 'Neha Gupta', 'Rajesh Kumar'];
  selectedUser = 'All Users';
  dateRange = 'Last 30 Days';
}
