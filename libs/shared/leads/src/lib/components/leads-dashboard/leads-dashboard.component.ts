import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../../services/leads.service';
import { KpiCard, Lead } from '../../models/lead.model';
import { LeadHeaderComponent } from '../lead-header/lead-header.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { RecentLeadsComponent } from '../recent-leads/recent-leads.component';
import { SharedDateRangePickerComponent } from '@shared/ui/src';

@Component({
  selector: 'lib-leads-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeadHeaderComponent,
    KpiCardsComponent,
    RecentLeadsComponent,
    SharedDateRangePickerComponent,
  ],
  templateUrl: './leads-dashboard.component.html',
})
export class LeadsDashboardComponent implements OnInit {
  kpiCards: KpiCard[] = [];
  recentLeads: Lead[] = [];
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  constructor(private readonly leadsService: LeadsService) {}

  ngOnInit(): void {
    this.leadsService.getKpiCards().subscribe((d: KpiCard[]) => this.kpiCards = d);
    this.leadsService.getRecentLeads().subscribe((d: Lead[]) => this.recentLeads = d);
  }

  onAddLead(): void {
    console.log('Add New Lead clicked');
  }

  onDateRangeChange(range: { start: Date | null; end: Date | null }): void {
    this.dateRange = range;
    console.log('Date range selected:', range);
  }
}
