import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Priority } from '../leads-add-lead.component';

@Component({
  selector: 'lib-lead-review-save-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-review-save-form.component.html',
})
export class LeadReviewSaveFormComponent {
  readonly form = input.required<FormGroup>();
  readonly priorities = input<Priority[]>([]);

  getStatusColor(status: string): string {
    const colors: Record<string, string> = { new: '#339AF0', hot: '#EF4444', warm: '#F59E0B', cold: '#6B7280' };
    return colors[status] || '#6B7280';
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!num) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(num);
  }
}
