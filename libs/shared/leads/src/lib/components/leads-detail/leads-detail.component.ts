import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeadsService, LEADS_SERVICE } from '../../services/leads.service';
import { LeadDetail } from '../../models/lead-api.model';
import { UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';

interface DetailState {
  loading: boolean;
  lead: LeadDetail | null;
  error: string;
}

@Component({
  selector: 'lib-leads-detail',
  standalone: true,
  imports: [CommonModule, UiBreadcrumbComponent],
  templateUrl: './leads-detail.component.html',
})
export class LeadsDetailComponent {
  @Input() set leadId(val: number | undefined) {
    if (val) this.loadLead(val);
  }

  private readonly leadsService = inject(LEADS_SERVICE);
  private readonly router = inject(Router);
  private readonly state = new BehaviorSubject<DetailState>({ loading: true, lead: null, error: '' });

  readonly vm$: Observable<DetailState> = this.state.asObservable();

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'CRM' },
    { label: 'Leads', link: '/leads/list' },
    { label: 'Lead Details' },
  ];

  private loadLead(id: number): void {
    this.state.next({ loading: true, lead: null, error: '' });
    this.leadsService.getLeadById(id).subscribe({
      next: (data) => this.state.next({ loading: false, lead: data, error: '' }),
      error: () => this.state.next({ loading: false, lead: null, error: 'Failed to load lead details.' }),
    });
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  onEdit(): void {
    this.router.navigate(['/admin/leads', this.leadId, 'edit']);
  }

  onBack(): void {
    this.router.navigate(['/admin/leads/list']);
  }

  formatAddress(lead: LeadDetail): string {
    const c = lead.contact;
    if (!c) return '';
    return [c.addressLine1, c.addressLine2, c.cityName, c.stateName, c.pincode].filter(x => !!x).join(', ');
  }
}
