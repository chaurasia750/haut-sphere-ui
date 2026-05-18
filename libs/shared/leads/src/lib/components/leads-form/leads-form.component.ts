import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-leads-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads-form.component.html',
})
export class LeadsFormComponent {
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
