import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Priority } from '../leads-add-lead.component';
import { LeadLookupItem } from '../../../models/lead-api.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'lib-lead-review-save-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-review-save-form.component.html',
})
export class LeadReviewSaveFormComponent {
  readonly form = input.required<FormGroup>();
  readonly priorities = input<Priority[]>([]);
  readonly users = input<User[]>([]);
  readonly leadSources = input<LeadLookupItem[]>([]);
  readonly leadStatuses = input<LeadLookupItem[]>([]);

  getUserName(id: number | null): string {
    if (!id) return '—';
    const user = this.users().find(u => u.id === id);
    return user ? user.fullName : '—';
  }

  getSourceName(id: number | null): string {
    if (!id) return '—';
    const source = this.leadSources().find(s => s.id === id);
    return source ? source.name : '—';
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

  formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!num) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(num);
  }
}
