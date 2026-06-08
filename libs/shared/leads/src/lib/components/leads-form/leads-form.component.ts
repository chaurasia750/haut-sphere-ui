import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';

@Component({
  selector: 'lib-leads-form',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBreadcrumbComponent],
  templateUrl: './leads-form.component.html',
})
export class LeadsFormComponent {
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'CRM' },
    { label: 'Leads', link: '/leads' },
    { label: 'Add Lead' },
  ];
  model = {
    name: '',
    mobile: '',
    email: '',
    status: 'new',
    assignedUser: '',
    city: '',
    expectedAmount: 0,
    notes: '',
  };

  assignedUsers = ['Anita Sharma', 'Vikram Patel', 'Neha Gupta', 'Rajesh Kumar'];
  cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'];

  onSubmit(): void {
    console.log('Lead submitted:', this.model);
  }
}
