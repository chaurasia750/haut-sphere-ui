import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../../services/leads.service';
import { KpiCard, StatusBreakdown, MonthlyTrend } from '../../models/lead.model';
import { LeadHeaderComponent } from '../lead-header/lead-header.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { SharedDateRangePickerComponent } from '@shared/ui/src';

@Component({
  selector: 'lib-leads-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeadHeaderComponent,
    KpiCardsComponent,
    SharedDateRangePickerComponent,
  ],
  templateUrl: './leads-dashboard.component.html',
})
export class LeadsDashboardComponent implements OnInit {
  kpiCards: KpiCard[] = [];
  statusBreakdown: StatusBreakdown[] = [];
  monthlyTrends: MonthlyTrend[] = [];
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  constructor(private readonly leadsService: LeadsService) {}

  ngOnInit(): void {
    this.leadsService.getKpiCards().subscribe((d: KpiCard[]) => this.kpiCards = d);
    this.leadsService.getLeadStatuses().subscribe((d: StatusBreakdown[]) => this.statusBreakdown = d);
    this.leadsService.getMonthlyTrends().subscribe((d: MonthlyTrend[]) => this.monthlyTrends = d);
  }

  get maxTrendValue(): number {
    return Math.max(...this.monthlyTrends.flatMap(t => [t.leads, t.conversions]), 1);
  }

  get totalStatusValue(): number {
    return this.statusBreakdown.reduce((sum, s) => sum + s.value, 0);
  }

  onAddLead(): void {
    console.log('Add New Lead clicked');
  }

  onDateRangeChange(range: { start: Date | null; end: Date | null }): void {
    this.dateRange = range;
    console.log('Date range selected:', range);
  }
}
