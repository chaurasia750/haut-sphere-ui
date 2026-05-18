import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Lead } from '../../models/lead.model';

@Component({
  selector: 'lib-recent-leads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-leads.component.html',
})
export class RecentLeadsComponent {
  @Input({ required: true }) leads: Lead[] = [];

  readonly badgeClass: Record<string, string> = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    hot: 'bg-red-50 text-red-500 border-red-200',
    warm: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    cold: 'bg-gray-50 text-gray-500 border-gray-200',
    converted: 'bg-green-50 text-green-600 border-green-200',
    lost: 'bg-pink-50 text-pink-500 border-pink-200',
  };

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  formatCurrency(val: number): string {
    if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return '₹' + (val / 1000).toFixed(0) + 'K';
    return '₹' + val;
  }
}
