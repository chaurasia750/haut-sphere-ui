import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';
import { SharedUserSelectComponent } from '../shared-user-select/shared-user-select.component';

@Component({
  selector: 'lib-lead-header',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBreadcrumbComponent, SharedUserSelectComponent],
  templateUrl: './lead-header.component.html',
})
export class LeadHeaderComponent {
  @Output() addLead = new EventEmitter<void>();
  @Input() appPrefix = '';

  get moduleName(): string { return this.appPrefix === 'member' ? 'Customers' : 'Leads'; }

  get breadcrumbItems(): BreadcrumbItem[] {
    return [
      { label: 'CRM' },
      { label: this.moduleName, link: `/${this.appPrefix === 'member' ? 'customers-dashboard' : 'leads'}` },
      { label: 'Dashboard' },
    ];
  }

  selectedUser: number | string = '';
  dateRange = 'Last 30 Days';
}
