import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedAddressFormComponent, SharedDatePickerComponent, UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';
import { apiConfig } from '@shared/environments/api.dev';
import { LEADS_SERVICE } from '../../services/leads.service';
import { USERS_SERVICE } from '../../services/users.service';
import { AddLeadRequest, LeadLookupItem, LeadDetail } from '../../models/lead-api.model';
import { User } from '../../models/user.model';
import { LeadInfoFormComponent } from './lead-info-form/lead-info-form.component';
import { LeadStepperComponent } from './lead-stepper/lead-stepper.component';
import { LeadNotesFollowupFormComponent } from './lead-notes-followup-form/lead-notes-followup-form.component';
import { LeadReviewSaveFormComponent } from './lead-review-save-form/lead-review-save-form.component';
import { InventoryTypeSelectComponent, INVENTORY_SERVICE } from '@shared/inventory/src';

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
  @Input() leadId: number | undefined;
  @Input() appPrefix = '';
  @Input() initialPropertyId: number | undefined;

  get addLabel(): string {
    return this.appPrefix === 'member' ? 'Add Customer' : 'Add Lead';
  }

  get moduleName(): string { return this.appPrefix === 'member' ? 'Customers' : 'Leads'; }
  get listRoute(): string { return this.appPrefix === 'member' ? `/${this.appPrefix}/customers-list` : `/${this.appPrefix}/leads/list`; }

  get breadcrumbItems(): BreadcrumbItem[] {
    return [
      { label: 'Home', link: `/${this.appPrefix === 'member' ? 'customers-dashboard' : 'leads'}` },
      { label: this.moduleName, link: this.listRoute },
      { label: this.leadId ? (this.appPrefix === 'member' ? 'Edit Customer' : 'Edit Lead') : this.addLabel },
    ];
  }

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly leadsService = inject(LEADS_SERVICE);
  private readonly usersService = inject(USERS_SERVICE);
  private readonly inventoryService = inject(INVENTORY_SERVICE);

  isEditMode = signal(false);
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
    this.isEditMode.set(!!this.leadId);

    if (this.leadId) {
      this.breadcrumbItems[2].label = 'Edit Lead';
    }

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

    if (this.leadId) {
      this.loadLeadForEdit(this.leadId);
    }

    if (this.initialPropertyId) {
      this.loadInitialProperty(this.initialPropertyId);
    }
  }

  private loadInitialProperty(propertyId: number): void {
    this.inventoryService.getPropertyById(propertyId).subscribe({
      next: (detail) => {
        const typeId = detail.propertyType;
        this.form.get('inventoryTypeId')?.setValue(typeId);
        this.form.get('inventoryPropertyId')?.setValue(propertyId);
      },
    });
  }

  private loadLeadForEdit(id: number): void {
    this.leadsService.getLeadById(id).subscribe({
      next: (lead) => this.patchForm(lead),
      error: () => this.submitError.set('Failed to load lead data for editing.'),
    });
  }

  private patchForm(lead: LeadDetail): void {
    const names = lead.title.split(' ');
    const salutation = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Mr', 'Mrs', 'Ms', 'Dr'].includes(names[0]) ? names[0] : '';
    const firstName = salutation ? names[1] || '' : names[0] || '';
    const lastName = salutation ? names.slice(2).join(' ') : names.slice(1).join(' ');

    const mobile = lead.contact.mobile.replace(/(\d{4})(\d{4})(\d{2})/, '$1 $2 $3');

    this.form.patchValue({
      title: salutation,
      firstName,
      lastName,
      gender: lead.contact.gender || '',
      mobileNumber: mobile,
      alternateMobile: lead.contact.alternateMobile,
      email: lead.contact.email,
      leadSource: lead.contact.sourceId ?? 0,
      leadStatus: lead.status.id,
      assignedUser: lead.assignedUser.id,
      expectedAmount: lead.expectedAmount,
      probabilityPercentage: lead.closingProbability,
      description: lead.description,
      expectedCloseDate: lead.expectedCloseDate ? lead.expectedCloseDate.split('T')[0] : '',
      addressLine1: lead.contact.addressLine1,
      addressLine2: lead.contact.addressLine2,
      postalCode: lead.contact.pincode,
      city: lead.contact.cityName,
      country: '',
      state: lead.contact.stateName,
      notes: lead.notes.map(n => n.noteText).join('\n'),
      followUpDate: lead.nextFollowupDate ? lead.nextFollowupDate.split('T')[0] : '',
      followUpTime: lead.nextFollowupDate ? lead.nextFollowupDate.split('T')[1]?.slice(0, 5) : '',
      priority: lead.priority.toLowerCase(),
      tags: lead.tags.map(t => t.name),
    });

    const leadAny = lead as any;
    const propertyId: number | undefined =
      (lead.leadFor && typeof lead.leadFor === 'object' ? (lead.leadFor as any).id : undefined) ??
      leadAny.leadForId ??
      undefined;
    const propertyTypeId: number | undefined =
      lead.leadFor && typeof lead.leadFor === 'object' ? (lead.leadFor as any).propertyType : undefined;

    if (propertyId || propertyTypeId) {
      if (propertyTypeId) this.form.get('inventoryTypeId')?.setValue(propertyTypeId);
      if (propertyId) this.form.get('inventoryPropertyId')?.setValue(propertyId);
      if (propertyId && !propertyTypeId) this.loadInitialProperty(propertyId);
    }
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
    assignedUser: ['', this.appPrefix === 'member' ? [] : [Validators.required]],
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

  private get stepFields(): Record<number, string[]> {
    const step1 = ['title', 'firstName', 'lastName', 'mobileNumber', 'email', 'leadSource', 'leadStatus', 'gender', 'expectedAmount', 'inventoryTypeId', 'addressLine1', 'postalCode', 'city', 'country', 'state'];
    if (this.appPrefix !== 'member') {
      step1.splice(step1.indexOf('expectedAmount'), 0, 'assignedUser');
    }
    return {
      1: step1,
      2: ['notes', 'followUpDate', 'followUpTime', 'priority', 'tags'],
    };
  }

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
    const [y, m, d] = dateStr.split('-').map(Number);
    if (timeStr) {
      const [h, min] = timeStr.split(':');
      return new Date(y, m - 1, d, +h, +min).toISOString();
    }
    return new Date(y, m - 1, d).toISOString();
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
        gender: v.gender,
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
    const formatted = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';
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

    const obs = this.isEditMode() && this.leadId
      ? this.leadsService.updateLead(this.leadId, payload)
      : this.leadsService.addLead(payload);

    (obs as any).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/' + this.appPrefix + '/leads/list']);
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.submitError.set(err?.error?.message || err?.message || 'Failed to save lead');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/' + this.appPrefix + '/leads/list']);
  }
}
