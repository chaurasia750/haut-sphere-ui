import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDatePickerComponent } from '@shared/ui/src';
import { Priority } from '../leads-add-lead.component';

@Component({
  selector: 'lib-lead-notes-followup-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedDatePickerComponent],
  templateUrl: './lead-notes-followup-form.component.html',
})
export class LeadNotesFollowupFormComponent {
  readonly form = input.required<FormGroup>();
  readonly priorities = input<Priority[]>([]);
  readonly availableTags = input<string[]>([]);

  selectedTag = '';

  isInvalid(controlName: string): boolean {
    const control = this.form().get(controlName);
    return !!(control?.touched && control?.invalid);
  }

  getError(controlName: string): string {
    const control = this.form().get(controlName);
    if (!control?.touched || !control?.errors) return '';
    if (control.errors['required']) {
      const labels: Record<string, string> = {
        priority: 'Priority',
      };
      return `${labels[controlName] || controlName} is required.`;
    }
    return 'Invalid input.';
  }

  get followUpDateValue(): Date | null {
    const val = this.form().get('followUpDate')?.value;
    return val ? new Date(val) : null;
  }

  onFollowUpDateChange(date: Date | null): void {
    const formatted = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';
    this.form().get('followUpDate')?.setValue(formatted);
  }

  addTag(tag: string): void {
    const control = this.form().get('tags');
    const current: string[] = control?.value || [];
    if (tag && !current.includes(tag)) {
      control?.setValue([...current, tag]);
    }
    this.selectedTag = '';
  }

  removeTag(tag: string): void {
    const control = this.form().get('tags');
    const current: string[] = control?.value || [];
    control?.setValue(current.filter(t => t !== tag));
  }
}
