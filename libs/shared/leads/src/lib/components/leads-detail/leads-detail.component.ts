import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeadsService, LEADS_SERVICE } from '../../services/leads.service';
import { LeadDetail } from '../../models/lead-api.model';
import { UiBreadcrumbComponent, BreadcrumbItem } from '@shared/ui/src';
import { LeadsFollowupComponent } from '../leads-followup/leads-followup.component';

interface DetailState {
  loading: boolean;
  lead: LeadDetail | null;
  error: string;
}

@Component({
  selector: 'lib-leads-detail',
  standalone: true,
  imports: [CommonModule, UiBreadcrumbComponent, LeadsFollowupComponent],
  templateUrl: './leads-detail.component.html',
})
export class LeadsDetailComponent {
  private _leadId: number | undefined;
  @Input() set leadId(val: number | undefined) {
    this._leadId = val;
    if (val) this.loadLead(val);
  }
  get leadId(): number | undefined { return this._leadId; }
  @Input() appPrefix = '';

  private readonly leadsService = inject(LEADS_SERVICE);
  private readonly router = inject(Router);
  private readonly state = new BehaviorSubject<DetailState>({ loading: true, lead: null, error: '' });

  readonly vm$: Observable<DetailState> = this.state.asObservable();

  get moduleName(): string { return this.appPrefix === 'member' ? 'Customers' : 'Leads'; }
  get listRoute(): string { return this.appPrefix === 'member' ? `/${this.appPrefix}/customers-list` : `/${this.appPrefix}/leads/list`; }

  get breadcrumbItems(): BreadcrumbItem[] {
    return [
      { label: 'CRM' },
      { label: this.moduleName, link: this.listRoute },
      { label: this.appPrefix === 'member' ? 'Customer Details' : 'Lead Details' },
    ];
  }

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
    if (this.appPrefix === 'member') {
      this.router.navigate(['/' + this.appPrefix + '/customers-detail', this.leadId]);
    } else {
      this.router.navigate(['/' + this.appPrefix + '/leads', this.leadId, 'edit']);
    }
  }

  onClosing(): void {
    if (this.appPrefix === 'admin') {
      this.router.navigate(['/' + this.appPrefix + '/leads', this.leadId, 'closing']);
    } else if (this.appPrefix === 'member') {
      this.router.navigate(['/' + this.appPrefix + '/customers-closing', this.leadId]);
    } else {
      this.router.navigate(['/leads-closing', this.leadId]);
    }
  }

  onBack(): void {
    this.router.navigate([this.listRoute]);
  }

  formatAddress(lead: LeadDetail): string {
    const c = lead.contact;
    if (!c) return '';
    return [c.addressLine1, c.addressLine2, c.cityName, c.stateName, c.pincode].filter(x => !!x).join(', ');
  }
}
