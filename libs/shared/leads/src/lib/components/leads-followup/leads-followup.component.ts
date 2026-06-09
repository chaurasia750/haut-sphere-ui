import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LeadDetail, FollowUpItem, CreateActivityRequest, ActivityType } from '../../models/lead-api.model';
import { LEADS_SERVICE } from '../../services/leads.service';
import { SharedSidePanelComponent, SharedDatePickerComponent } from '@shared/ui/src';

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
  imports: [CommonModule, FormsModule, SharedSidePanelComponent, SharedDatePickerComponent],
  template: `
    <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h4 class="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Follow-up</h4>

      <div class="flex flex-col items-center rounded-xl bg-gradient-to-br from-[#FFF8E1] to-[#FFECB3] p-4 text-center">
        <svg class="mb-2 h-8 w-8 text-[#FFC107]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>

        @if (nextFollowUp; as nf) {
          <p class="text-lg font-bold text-[#111111]">{{ nf.nextFollowupDate | date:'dd MMM yyyy' }}</p>
          <p class="text-xs text-gray-600">{{ nf.nextFollowupDate | date:'hh:mm a' }}</p>
          <span class="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Upcoming
          </span>
        } @else {
          <p class="text-sm font-medium text-gray-500">No follow-up scheduled</p>
          <span class="mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">Not set</span>
        }

        <button (click)="panelOpen = true"
          class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD000] px-5 py-3 text-sm font-bold text-black shadow-lg shadow-[#FFC107]/30 transition-all duration-200 hover:from-[#FFD000] hover:to-[#FFE082] hover:shadow-xl hover:shadow-[#FFC107]/40 active:scale-[0.98]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Schedule Follow-up</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div class="mt-3 space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-gray-500">Expected Close</span>
          <span class="font-medium text-[#111111]">{{ lead.expectedCloseDate ? (lead.expectedCloseDate | date:'dd MMM yyyy') : 'Not set' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-500">Last Activity</span>
          <span class="font-medium text-[#111111]">{{ lead.lastActivityDate ? (lead.lastActivityDate | date:'dd MMM yyyy') : 'N/A' }}</span>
        </div>
      </div>
    </div>

    <shared-side-panel [isOpen]="panelOpen" title="Schedule Follow-up" (closed)="panelOpen = false; formExpanded = true; historyExpanded = true">
      <div class="flex flex-col divide-y divide-gray-100 -mx-6 -mt-5">

        <div>
          <button type="button" (click)="historyExpanded = !historyExpanded"
            class="flex w-full items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50/60 transition-colors">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Follow-up History</span>
            <span class="flex items-center gap-2">
              @if (followUps.length) {
                <span class="rounded-full bg-[#FFF3CD] px-2.5 py-0.5 text-[10px] font-medium text-[#856404]">{{ followUps.length }}</span>
              }
              <svg [ngClass]="historyExpanded ? 'rotate-180' : ''" class="h-4 w-4 text-gray-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          @if (historyExpanded) {
            <div class="px-6 pb-5 pt-2">
              @if (followUps.length) {
                <div class="relative max-h-[260px] overflow-y-auto">
                  <div class="absolute left-3 top-0 h-full w-0.5 bg-gray-100"></div>
                  <div class="space-y-3">
                    @for (a of followUps; track a.activityId) {
                      <div class="relative flex gap-3 pl-9">
                        <div class="absolute left-1.5 top-1.5 z-10 h-3 w-3 rounded-full border-2"
                          [style.borderColor]="getActivityColor(a.activityType)"
                          [style.backgroundColor]="getActivityColor(a.activityType) + '1A'">
                        </div>
                        <div class="min-w-0 flex-1 rounded-lg border border-gray-50 bg-gray-50/50 p-2.5">
                          <div class="flex items-start justify-between gap-2">
                            <div>
                              <p class="text-sm font-semibold text-[#111111]">{{ a.subject }}</p>
                              <p class="text-[11px] text-gray-400">{{ a.activityDate | date:'dd MMM yyyy, hh:mm a' }}</p>
                            </div>
                            <span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                              [style.background]="getActivityColor(a.activityType) + '1A'"
                              [style.color]="getActivityColor(a.activityType)">
                              {{ a.activityType }}
                            </span>
                          </div>
                          @if (a.description) {
                            <p class="mt-1 text-xs text-gray-500">{{ a.description }}</p>
                          }
                          @if (a.nextFollowupDate) {
                            <div class="mt-2 flex items-center gap-1.5 text-[11px] text-[#FFC107]">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              Next: {{ a.nextFollowupDate | date:'dd MMM yyyy, hh:mm a' }}
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <p class="py-3 text-center text-xs text-gray-400">No follow-up history yet</p>
              }
            </div>
          }
        </div>

        <div>
          <button type="button" (click)="formExpanded = !formExpanded"
            class="flex w-full items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50/60 transition-colors">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">New Follow-up</span>
            <svg [ngClass]="formExpanded ? 'rotate-180' : ''" class="h-4 w-4 text-gray-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          @if (formExpanded) {
            <div class="px-6 pb-5 pt-2 space-y-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-500">Type</label>
                <select [(ngModel)]="formData.activityTypeId"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107]">
                  @for (t of activityTypes; track t.id) {
                    <option [value]="t.id">{{ t.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-500">Subject</label>
                <input [(ngModel)]="formData.subject" type="text" placeholder="e.g. Follow-up Call"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107]">
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-500">Description</label>
                <textarea [(ngModel)]="formData.description" rows="3" placeholder="Add notes..."
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107]"></textarea>
              </div>
              <shared-date-picker label="Activity Date" [value]="formData.activityDate" (valueChange)="onActivityDateChange($event)"/>
              <shared-date-picker label="Next Follow-up Date" [value]="formData.nextFollowupDate" (valueChange)="formData.nextFollowupDate = $event"/>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-500">Duration (minutes)</label>
                <input [(ngModel)]="formData.durationMinutes" type="number" min="1"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107]">
              </div>
              <div class="flex items-center gap-2 pt-1">
                <button (click)="submitFollowUp()" [disabled]="submitting || !formData.subject.trim()"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-[#FFC107] px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-[#FFD000] disabled:opacity-50">
                  @if (submitting) {
                    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" class="opacity-75"/></svg>
                  }
                  Save
                </button>
                <button (click)="panelOpen = false"
                  class="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          }
        </div>

      </div>
    </shared-side-panel>
  `,
})
export class LeadsFollowupComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly leadsService = inject(LEADS_SERVICE);

  @Input({ required: true }) lead!: LeadDetail;

  followUps: FollowUpItem[] = [];
  loading = false;
  panelOpen = false;
  submitting = false;
  formExpanded = true;
  historyExpanded = true;

  activityTypes = ACTIVITY_TYPES;

  formData = {
    activityTypeId: 1,
    subject: '',
    description: '',
    activityDate: new Date(),
    nextFollowupDate: null as Date | null,
    durationMinutes: 15,
  };

  ngOnInit() {
    this.loadFollowUps();
  }

  get nextFollowUp(): FollowUpItem | null {
    const upcoming = this.followUps
      .filter(i => i.nextFollowupDate)
      .sort((a, b) => new Date(a.nextFollowupDate).getTime() - new Date(b.nextFollowupDate).getTime());
    return upcoming.length ? upcoming[0] : null;
  }

  onActivityDateChange(date: Date | null): void {
    this.formData.activityDate = date ?? new Date();
  }

  getActivityColor(type: string): string {
    const t = this.activityTypes.find(at => at.name === type);
    return t ? t.color : '#868E96';
  }

  submitFollowUp() {
    if (!this.formData.subject.trim()) return;
    this.submitting = true;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const payload: CreateActivityRequest = {
      activityTypeId: this.formData.activityTypeId,
      subject: this.formData.subject.trim(),
      description: this.formData.description.trim(),
      activityDate: fmt(this.formData.activityDate),
      nextFollowupDate: this.formData.nextFollowupDate ? fmt(this.formData.nextFollowupDate) : undefined,
      durationMinutes: this.formData.durationMinutes,
    };

    this.leadsService.createActivity(this.lead.id, payload).pipe(
      finalize(() => {
        this.submitting = false;
      })
    ).subscribe({
      next: () => {
        this.panelOpen = false;
        this.loadFollowUps();
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
