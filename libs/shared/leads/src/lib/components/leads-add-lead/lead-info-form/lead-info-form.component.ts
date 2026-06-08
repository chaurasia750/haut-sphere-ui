import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedTitleSelectComponent, PhoneFormatDirective, CurrencyFormatDirective } from '@shared/ui/src';

@Component({
  selector: 'lib-lead-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedTitleSelectComponent, PhoneFormatDirective, CurrencyFormatDirective],
  templateUrl: './lead-info-form.component.html',
})
export class LeadInfoFormComponent {
  readonly form = input.required<FormGroup>();
  readonly leadSources = input<string[]>([]);
  readonly leadStatuses = input<string[]>([]);
  readonly assignedUsers = input<string[]>([]);

  isInvalid(controlName: string): boolean {
    const control = this.form().get(controlName);
    return !!(control?.touched && control?.invalid);
  }

  getError(controlName: string): string {
    const control = this.form().get(controlName);
    if (!control?.touched || !control?.errors) return '';
    if (control.errors['required']) {
      const labels: Record<string, string> = {
        title: 'Title',
        firstName: 'First name',
        lastName: 'Last name',
        mobileNumber: 'Mobile number',
        email: 'Email',
        leadSource: 'Lead source',
        leadStatus: 'Lead status',
        gender: 'Gender',
        assignedUser: 'Assigned user',
        expectedAmount: 'Expected amount',
      };
      return `${labels[controlName] || controlName} is required.`;
    }
    if (controlName === 'title') return 'Please select a title.';
    if (controlName === 'gender') return 'Please select a gender.';
    if (controlName === 'firstName' || controlName === 'lastName') return `${controlName === 'firstName' ? 'First name' : 'Last name'} is required.`;
    if (control.errors['email']) return 'Enter a valid email address.';
    if (control.errors['pattern']) {
      if (controlName === 'mobileNumber') return 'Enter a valid 10-digit mobile number.';
      if (controlName === 'alternateMobile') return 'Enter a valid 10-digit alternate mobile number.';
    }
    if (control.errors['min']) return 'Value must be at least 0.';
    return 'Invalid input.';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = { new: '#339AF0', hot: '#EF4444', warm: '#F59E0B', cold: '#6B7280' };
    return colors[status] || '#6B7280';
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
