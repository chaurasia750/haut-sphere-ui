import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedTitleSelectComponent, PhoneFormatDirective } from '@shared/ui/src';
import { AmountSliderComponent } from '../../amount-slider/amount-slider.component';
import { LeadLookupItem } from '../../../models/lead-api.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'lib-lead-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedTitleSelectComponent, PhoneFormatDirective, AmountSliderComponent],
  templateUrl: './lead-info-form.component.html',
})
export class LeadInfoFormComponent {
  readonly form = input.required<FormGroup>();
  readonly leadSources = input<LeadLookupItem[]>([]);
  readonly leadStatuses = input<LeadLookupItem[]>([]);
  readonly users = input<User[]>([]);
  readonly showAssignUser = input(true);

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

  getStatusColor(id: number | null): string {
    if (!id) return '#6B7280';
    const item = this.leadStatuses().find(s => s.id === id);
    return item?.colorCode || '#6B7280';
  }

  getStatusLabel(id: number | null): string {
    if (!id) return '';
    const item = this.leadStatuses().find(s => s.id === id);
    return item?.name || '';
  }
}
