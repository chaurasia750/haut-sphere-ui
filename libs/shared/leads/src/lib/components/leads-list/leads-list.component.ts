import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../../services/leads.service';
import { Lead } from '../../models/lead.model';
import { LeadFilters } from '../leads-filters/leads-filters.component';
import { LeadsFiltersComponent } from '../leads-filters/leads-filters.component';
import { LeadsTableComponent } from '../leads-table/leads-table.component';

@Component({
  selector: 'lib-leads-list',
  standalone: true,
  imports: [CommonModule, LeadsFiltersComponent, LeadsTableComponent],
  templateUrl: './leads-list.component.html',
})
export class LeadsListComponent implements OnInit {
  allLeads: Lead[] = [];
  filteredLeads: Lead[] = [];

  constructor(private readonly leadsService: LeadsService) {}

  ngOnInit(): void {
    this.leadsService.getLeads().subscribe(d => {
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

  onEditLead(lead: Lead): void {
    console.log('Edit lead:', lead.id);
  }
}
