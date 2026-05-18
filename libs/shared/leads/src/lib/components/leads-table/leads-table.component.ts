import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lead } from '../../models/lead.model';

@Component({
  selector: 'lib-leads-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads-table.component.html',
})
export class LeadsTableComponent {
  readonly Math = Math;
  @Input({ required: true }) leads: Lead[] = [];
  @Input() pageSize = 5;
  @Output() editLead = new EventEmitter<Lead>();

  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.leads.length / this.pageSize) || 1;
  }

  get paginatedLeads(): Lead[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.leads.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  readonly statusBadge: Record<string, string> = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    hot: 'bg-red-50 text-red-500 border-red-200',
    warm: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    cold: 'bg-gray-50 text-gray-500 border-gray-200',
    converted: 'bg-green-50 text-green-600 border-green-200',
    lost: 'bg-pink-50 text-pink-500 border-pink-200',
  };

  formatCurrency(val: number): string {
    if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return '₹' + (val / 1000).toFixed(0) + 'K';
    return '₹' + val;
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
