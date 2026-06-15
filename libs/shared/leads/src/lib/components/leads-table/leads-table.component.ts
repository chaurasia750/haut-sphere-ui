import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Lead } from '../../models/lead.model';

@Component({
  selector: 'lib-leads-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads-table.component.html',
})
export class LeadsTableComponent {
  @Input({ required: true }) leads: Lead[] = [];
  @Input() selectedIds = new Set<number>();
  @Input() allSelected = false;
  @Output() selectionChange = new EventEmitter<{ leadId: number; checked: boolean }>();
  @Output() toggleAll = new EventEmitter<void>();
  @Output() editLead = new EventEmitter<Lead>();
  @Output() followUp = new EventEmitter<Lead>();
  @Output() closing = new EventEmitter<Lead>();

  openMenuId: number | null = null;

  readonly statusBadge: Record<string, string> = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    hot: 'bg-red-50 text-red-500 border-red-200',
    warm: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    cold: 'bg-gray-50 text-gray-500 border-gray-200',
    converted: 'bg-green-50 text-green-600 border-green-200',
    lost: 'bg-pink-50 text-pink-500 border-pink-200',
  };

  toggleMenu(leadId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === leadId ? null : leadId;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId = null;
  }

  formatCurrency(val: number): string {
    if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return '₹' + (val / 1000).toFixed(0) + 'K';
    return '₹' + val;
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
