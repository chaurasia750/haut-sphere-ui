import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LeadInfoFormComponent } from './lead-info-form/lead-info-form.component';
import { LeadStepperComponent } from './lead-stepper/lead-stepper.component';
import { LeadNotesFollowupFormComponent } from './lead-notes-followup-form/lead-notes-followup-form.component';
import { LeadReviewSaveFormComponent } from './lead-review-save-form/lead-review-save-form.component';

export interface Priority {
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'lib-leads-add-lead',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LeadInfoFormComponent,
    LeadStepperComponent,
    LeadNotesFollowupFormComponent,
    LeadReviewSaveFormComponent,
  ],
  templateUrl: './leads-add-lead.component.html',
})
export class LeadsAddLeadComponent {
  private readonly fb = inject(FormBuilder);

  currentStep = signal(1);
  totalSteps = 3;

  readonly steps = [
    { id: 1, label: 'Lead Information' },
    { id: 2, label: 'Notes & Follow Up' },
    { id: 3, label: 'Review & Save' },
  ];

  readonly leadSources = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Phone Inquiry', 'Walk-in', 'Partner', 'Event'];
  readonly leadStatuses = ['new', 'hot', 'warm', 'cold'];
  readonly assignedUsers = ['Anita Sharma', 'Vikram Patel', 'Neha Gupta', 'Rajesh Kumar', 'Priya Singh'];
  readonly priorities: Priority[] = [
    { value: 'high', label: 'High', color: '#EF4444' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'low', label: 'Low', color: '#10B981' },
  ];
  readonly availableTags = ['Urgent', 'High Budget', 'Decision Maker', 'Follow-up', 'New', 'VIP', 'Corporate', 'Individual'];

  readonly form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{2}$/)]],
    alternateMobile: ['', Validators.pattern(/^\d{4} \d{4} \d{2}$/)],
    email: ['', [Validators.required, Validators.email]],

    leadSource: ['', Validators.required],
    leadStatus: ['new', Validators.required],
    gender: ['', Validators.required],
    assignedUser: ['', Validators.required],
    expectedAmount: [0, [Validators.required, Validators.min(0)]],
    probabilityPercentage: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    notes: [''],
    followUpDate: [''],
    followUpTime: [''],
    priority: ['medium', Validators.required],
    tags: [[]],
  });

  private readonly stepFields: Record<number, string[]> = {
    1: ['title', 'firstName', 'lastName', 'mobileNumber', 'email', 'leadSource', 'leadStatus', 'gender', 'assignedUser', 'expectedAmount'],
    2: ['notes', 'followUpDate', 'followUpTime', 'priority', 'tags'],
  };

  isLastStep(): boolean {
    return this.currentStep() === this.totalSteps;
  }

  isFirstStep(): boolean {
    return this.currentStep() === 1;
  }

  nextStep(): void {
    const fields = this.stepFields[this.currentStep()];
    fields.forEach(f => this.form.get(f)?.markAsTouched());

    const invalid = fields.some(f => this.form.get(f)?.invalid);
    if (invalid) return;

    if (this.currentStep() < this.totalSteps) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Lead submitted:', this.form.value);
  }

  onCancel(): void {
    console.log('Cancelled');
  }
}
