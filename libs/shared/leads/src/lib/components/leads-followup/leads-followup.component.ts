import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LeadDetail, FollowUpItem, CreateActivityRequest, ActivityType } from '../../models/lead-api.model';
import { LEADS_SERVICE } from '../../services/leads.service';
import { SharedSidePanelComponent, SharedDatePickerComponent, UiButtonComponent } from '@shared/ui/src';

const ACTIVITY_TYPES: ActivityType[] = [
  { id: 1, name: 'Call', icon: 'phone', color: '#4CAF50' },
  { id: 2, name: 'Site Visit', icon: 'location', color: '#FF9800' },
  { id: 3, name: 'Meeting', icon: 'users', color: '#CC5DE8' },
  { id: 4, name: 'Email', icon: 'mail', color: '#339AF0' },
  { id: 5, name: 'Other', icon: 'more-horizontal', color: '#868E96' },
];

@Component({
  selector: 'lib-leads-followup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedSidePanelComponent, SharedDatePickerComponent, UiButtonComponent],
  templateUrl: './leads-followup.component.html',
})
export class LeadsFollowupComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly leadsService = inject(LEADS_SERVICE);
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) lead!: LeadDetail;
  @Input() autoOpen = false;
  @Output() closed = new EventEmitter<void>();

  followUps: FollowUpItem[] = [];
  loading = false;
  panelOpen = false;
  submitting = false;
  formExpanded = true;
  historyExpanded = false;

  activityTypes = ACTIVITY_TYPES;

  followUpForm: FormGroup = this.fb.group({
    activityTypeId: [1, Validators.required],
    subject: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.required],
    activityDate: [new Date(), Validators.required],
    nextFollowupDate: [null, Validators.required],
    nextFollowupTime: ['17:00', Validators.required],
    durationMinutes: [15, [Validators.required, Validators.min(1)]],
  });

  get fc() { return this.followUpForm.controls; }

  ngOnInit() {
    this.loadFollowUps();
    if (this.autoOpen) {
      this.panelOpen = true;
    }
  }

  get nextFollowUp(): FollowUpItem | null {
    const upcoming = this.followUps
      .filter(i => i.nextFollowupDate)
      .sort((a, b) => new Date(a.nextFollowupDate).getTime() - new Date(b.nextFollowupDate).getTime());
    return upcoming.length ? upcoming[0] : null;
  }

  onActivityDateChange(date: Date | null): void {
    this.fc['activityDate'].setValue(date ?? new Date());
  }

  onNextFollowupDateChange(date: Date | null): void {
    this.fc['nextFollowupDate'].setValue(date);
  }

  getActivityColor(type: string): string {
    const t = this.activityTypes.find(at => at.name === type);
    return t ? t.color : '#868E96';
  }

  submitFollowUp() {
    if (this.followUpForm.invalid) return;
    this.submitting = true;

    const v = this.followUpForm.value;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const fmtDateTime = (d: Date, time?: string) => {
      if (time) {
        const [h, m] = time.split(':').map(Number);
        d = new Date(d);
        d.setHours(h, m, 0, 0);
      }
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    };

    const payload: CreateActivityRequest = {
      activityTypeId: v.activityTypeId,
      subject: v.subject.trim(),
      description: (v.description ?? '').trim(),
      activityDate: fmtDateTime(v.activityDate),
      nextFollowupDate: v.nextFollowupDate ? fmtDateTime(v.nextFollowupDate, v.nextFollowupTime) : undefined,
      durationMinutes: v.durationMinutes,
    };

    this.leadsService.createActivity(this.lead.id, payload).pipe(
      finalize(() => {
        this.submitting = false;
      })
    ).subscribe({
      next: () => {
        this.panelOpen = false;
        this.followUpForm.reset({
          activityTypeId: 1,
          subject: '',
          description: '',
          activityDate: new Date(),
          nextFollowupDate: null,
          nextFollowupTime: '17:00',
          durationMinutes: 15,
        });
        this.loadFollowUps();
        this.closed.emit();
      },
    });
  }

  private loadFollowUps() {
    this.loading = true;
    this.leadsService.getFollowUps({ LeadId: this.lead.id, PageSize: 50 }).subscribe({
      next: (res) => {
        this.followUps = res.items;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
