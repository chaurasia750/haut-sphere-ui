import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedAddressFormComponent, SharedDatePickerComponent, UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';
import { apiConfig } from '@shared/environments/api.dev';
import { LEADS_SERVICE } from '../../services/leads.service';
import { USERS_SERVICE } from '../../services/users.service';
import { AddLeadRequest, LeadLookupItem } from '../../models/lead-api.model';
import { User } from '../../models/user.model';
import { LeadInfoFormComponent } from './lead-info-form/lead-info-form.component';
import { LeadStepperComponent } from './lead-stepper/lead-stepper.component';
import { LeadNotesFollowupFormComponent } from './lead-notes-followup-form/lead-notes-followup-form.component';
import { LeadReviewSaveFormComponent } from './lead-review-save-form/lead-review-save-form.component';
import { InventoryTypeSelectComponent } from '@shared/inventory/src';

export interface Priority {
  value: string;
  label: string;
  color: string;
}

interface LookupMap {
  [key: string]: number;
}

@Component({
  selector: 'lib-leads-add-lead',
  standalone: true,
  imports: [
    CommonModule,
    LeadInfoFormComponent,
    LeadStepperComponent,
    LeadNotesFollowupFormComponent,
    LeadReviewSaveFormComponent,
    InventoryTypeSelectComponent,
    SharedAddressFormComponent,
    SharedDatePickerComponent,
    UiBreadcrumbComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './leads-add-lead.component.html',
})
export class LeadsAddLeadComponent implements OnInit {
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/leads' },
    { label: 'Leads', link: '/leads/list' },
    { label: 'Add Lead' },
  ];

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly leadsService = inject(LEADS_SERVICE);
  private readonly usersService = inject(USERS_SERVICE);

  submitting = signal(false);
  submitError = signal('');

  readonly apiBaseUrl = apiConfig.baseUrl;

  currentStep = signal(1);
  totalSteps = 3;

  readonly steps = [
    { id: 1, label: 'Lead Information' },
    { id: 2, label: 'Notes & Follow Up' },
    { id: 3, label: 'Review & Save' },
  ];

  readonly leadSources = signal<LeadLookupItem[]>([]);
  readonly leadStatuses = signal<LeadLookupItem[]>([]);
  readonly users = signal<User[]>([]);
  readonly priorities: Priority[] = [
    { value: 'high', label: 'High', color: '#EF4444' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'low', label: 'Low', color: '#10B981' },
  ];
  readonly availableTags = ['Urgent', 'High Budget', 'Decision Maker', 'Follow-up', 'New', 'VIP', 'Corporate', 'Individual'];

  ngOnInit(): void {
    this.leadsService.getLeadSources().subscribe({
      next: (data) => this.leadSources.set(data),
      error: () => this.leadSources.set([]),
    });

    this.leadsService.getLeadStatusLookup().subscribe({
      next: (data) => this.leadStatuses.set(data),
      error: () => this.leadStatuses.set([]),
    });

    this.usersService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.users.set([]),
    });
  }

  private readonly tagMap: LookupMap = {
    'Urgent': 1, 'High Budget': 2, 'Decision Maker': 3, 'Follow-up': 4,
    'New': 5, 'VIP': 6, 'Corporate': 7, 'Individual': 8,
  };

  readonly form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{2}$/)]],
    alternateMobile: ['', Validators.pattern(/^\d{4} \d{4} \d{2}$/)],
    email: ['', [Validators.required, Validators.email]],

    leadSource: ['', Validators.required],
    leadStatus: ['', Validators.required],
    gender: ['', Validators.required],
    assignedUser: ['', Validators.required],
    inventoryTypeId: ['', Validators.required],
    inventoryPropertyId: [''],
    expectedAmount: ['', [Validators.required, Validators.min(0)]],
    probabilityPercentage: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    description: [''],
    expectedCloseDate: [''],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    notes: [''],
    followUpDate: [''],
    followUpTime: [''],
    priority: ['medium', Validators.required],
    tags: [[]],
  }, { validators: this.dateValidator });

  private readonly stepFields: Record<number, string[]> = {
     1: ['title', 'firstName', 'lastName', 'mobileNumber', 'email', 'leadSource', 'leadStatus', 'gender', 'assignedUser', 'expectedAmount', 'inventoryTypeId', 'addressLine1', 'postalCode', 'city', 'country', 'state'],
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

  private stripMobile(value: string): string {
    return value ? value.replace(/\s/g, '') : '';
  }

  private formatDate(dateStr: string, timeStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (timeStr) {
      const [h, m] = timeStr.split(':');
      d.setHours(+h, +m, 0, 0);
    }
    return d.toISOString();
  }

  private buildPayload(): AddLeadRequest {
    const v = this.form.value;

    const title = `${v.title} ${v.firstName} ${v.lastName}`.trim();

    const followUp = this.formatDate(v.followUpDate, v.followUpTime);
    const closeDate = v.expectedCloseDate
      ? this.formatDate(v.expectedCloseDate, '')
      : followUp;

    return {
      customerInfo: {
        firstName: v.firstName,
        lastName: v.lastName,
        mobile: this.stripMobile(v.mobileNumber),
        alternateMobile: this.stripMobile(v.alternateMobile),
        email: v.email,
        stateName: v.state,
        cityName: v.city,
        pincode: v.postalCode,
        addressLine1: v.addressLine1,
        addressLine2: v.addressLine2,
      },
      title,
      description: v.description || '',
      leadForId: v.inventoryPropertyId ? +v.inventoryPropertyId : 0,
      statusId: v.leadStatus || 0,
      priority: v.priority,
      expectedAmount: v.expectedAmount ? +v.expectedAmount : 0,
      closingProbability: v.probabilityPercentage,
      expectedCloseDate: closeDate,
      nextFollowupDate: followUp,
      assignedUserId: v.assignedUser ? +v.assignedUser : 0,
      sourceId: v.leadSource || 0,
      note: v.notes || '',
      tagIds: (v.tags || []).map((tag: string) => this.tagMap[tag]).filter(Boolean),
    };
  }

  get expectedCloseDateValue(): Date | null {
    const val = this.form.get('expectedCloseDate')?.value;
    return val ? new Date(val) : null;
  }

  onExpectedCloseDateChange(date: Date | null): void {
    const formatted = date ? date.toISOString().split('T')[0] : '';
    this.form.get('expectedCloseDate')?.setValue(formatted);
  }

  private dateValidator(group: AbstractControl): ValidationErrors | null {
    const followUp = group.get('followUpDate')?.value;
    const close = group.get('expectedCloseDate')?.value;

    if (followUp && close && new Date(close) < new Date(followUp)) {
      return { closeBeforeFollowUp: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');

    const payload = this.buildPayload();

    this.leadsService.addLead(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/admin/leads']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(err?.error?.message || err?.message || 'Failed to create lead');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/leads']);
  }
}
