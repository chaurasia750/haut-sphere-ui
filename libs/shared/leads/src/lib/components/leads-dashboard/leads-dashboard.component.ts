import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LeadsService } from '../../services/leads.service';
import { KpiCard, Lead, StatusBreakdown, MonthlyTrend } from '../../models/lead.model';
import { LeadHeaderComponent } from '../lead-header/lead-header.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { LeadsChartsComponent } from '../leads-charts/leads-charts.component';
import { RecentLeadsComponent } from '../recent-leads/recent-leads.component';
import { LeadsFiltersComponent, LeadFilters } from '../leads-filters/leads-filters.component';
import { LeadsTableComponent } from '../leads-table/leads-table.component';

@Component({
  selector: 'lib-leads-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeadHeaderComponent,
    KpiCardsComponent,
    LeadsChartsComponent,
    RecentLeadsComponent,
    LeadsFiltersComponent,
    LeadsTableComponent,
  ],
  templateUrl: './leads-dashboard.component.html',
})
export class LeadsDashboardComponent implements OnInit {
  @Output() viewList = new EventEmitter<void>();
  kpiCards: KpiCard[] = [];
  leadStatuses: StatusBreakdown[] = [];
  monthlyTrends: MonthlyTrend[] = [];
  recentLeads: Lead[] = [];
  allLeads: Lead[] = [];
  filteredLeads: Lead[] = [];

  constructor(private readonly leadsService: LeadsService) {}

  ngOnInit(): void {
    this.leadsService.getKpiCards().subscribe((d: KpiCard[]) => this.kpiCards = d);
    this.leadsService.getLeadStatuses().subscribe((d: StatusBreakdown[]) => this.leadStatuses = d);
    this.leadsService.getMonthlyTrends().subscribe((d: MonthlyTrend[]) => this.monthlyTrends = d);
    this.leadsService.getRecentLeads().subscribe((d: Lead[]) => this.recentLeads = d);
    this.leadsService.getLeads().subscribe((d: Lead[]) => {
      this.allLeads = d;
      this.filteredLeads = [...d];
    });
  }

  onFilterChange(filters: LeadFilters): void {
    let result = [...this.allLeads];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.mobile.includes(q));
    }
    if (filters.status) result = result.filter(l => l.status === filters.status);
    if (filters.assignedUser) result = result.filter(l => l.assignedUser === filters.assignedUser);
    if (filters.city) result = result.filter(l => l.city === filters.city);
    if (filters.followupDate) result = result.filter(l => l.followupDate === filters.followupDate);
    this.filteredLeads = result;
  }

  onAddLead(): void {
    console.log('Add New Lead clicked');
  }

  onEditLead(lead: Lead): void {
    console.log('Edit lead:', lead.id);
  }
}
