import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiConfig } from '@shared/environments/api.dev';
import { KpiCard, Lead, StatusBreakdown, MonthlyTrend } from '../models/lead.model';
import { AddLeadRequest, AddLeadResponse, LeadLookupItem, GetLeadsRequest, PaginatedResponse } from '../models/lead-api.model';

export const LEAD_API_BASE_URL = new InjectionToken<string>('LEAD_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/leads`,
});

export const LEADS_LOOKUP_API_BASE_URL = new InjectionToken<string>('LEADS_LOOKUP_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/leads-lookup`,
});

export const LEADS_SERVICE = new InjectionToken<ILeadsService>('LEADS_SERVICE', {
  factory: () => inject(LeadsService),
});

export interface ILeadsService {
  getKpiCards(): Observable<KpiCard[]>;
  getLeadStatuses(): Observable<StatusBreakdown[]>;
  getMonthlyTrends(): Observable<MonthlyTrend[]>;
  getRecentLeads(): Observable<Lead[]>;
  getLeads(params?: GetLeadsRequest): Observable<PaginatedResponse<Lead>>;
  addLead(payload: AddLeadRequest): Observable<AddLeadResponse>;
  getLeadSources(): Observable<LeadLookupItem[]>;
  getLeadStatusLookup(): Observable<LeadLookupItem[]>;
}

@Injectable({ providedIn: 'root' })
export class LeadsService implements ILeadsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(LEAD_API_BASE_URL);
  private readonly lookupBaseUrl = inject(LEADS_LOOKUP_API_BASE_URL);

  getKpiCards(): Observable<KpiCard[]> {
    return of([
      { label: 'Total Leads', value: 1248, icon: 'users', growth: 12.5, color: '#339AF0' },
      { label: 'Hot Leads', value: 186, icon: 'fire', growth: 8.2, color: '#FF6B6B' },
      { label: 'Follow-ups Today', value: 43, icon: 'phone', growth: -3.1, color: '#FFC107' },
      { label: 'Converted', value: 527, icon: 'check', growth: 15.7, color: '#51CF66' },
      { label: 'Today Leads', value: 12, icon: 'trending-up', growth: 0, color: '#CC5DE8' },
    ]);
  }

  getLeadStatuses(): Observable<StatusBreakdown[]> {
    return of([
      { label: 'New', value: 342, color: '#339AF0' },
      { label: 'Hot', value: 186, color: '#FF6B6B' },
      { label: 'Warm', value: 251, color: '#FFC107' },
      { label: 'Cold', value: 198, color: '#868E96' },
      { label: 'Converted', value: 527, color: '#51CF66' },
      { label: 'Lost', value: 112, color: '#F06595' },
    ]);
  }

  getMonthlyTrends(): Observable<MonthlyTrend[]> {
    return of([
      { month: 'Jan', leads: 180, conversions: 65 },
      { month: 'Feb', leads: 200, conversions: 78 },
      { month: 'Mar', leads: 165, conversions: 55 },
      { month: 'Apr', leads: 220, conversions: 92 },
      { month: 'May', leads: 195, conversions: 74 },
      { month: 'Jun', leads: 240, conversions: 105 },
      { month: 'Jul', leads: 210, conversions: 88 },
      { month: 'Aug', leads: 260, conversions: 120 },
      { month: 'Sep', leads: 230, conversions: 95 },
      { month: 'Oct', leads: 280, conversions: 130 },
      { month: 'Nov', leads: 250, conversions: 110 },
      { month: 'Dec', leads: 310, conversions: 145 },
    ]);
  }

  getRecentLeads(): Observable<Lead[]> {
    return this.getLeads({ page: 1, pageSize: 8 }).pipe(map(res => res.items));
  }

  getLeads(params?: GetLeadsRequest): Observable<PaginatedResponse<Lead>> {
    const query: Record<string, string | number> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          query[key] = value;
        }
      }
    }
    return this.http.get<PaginatedResponse<Lead>>(this.baseUrl, { params: query });
  }

  addLead(payload: AddLeadRequest): Observable<AddLeadResponse> {
    return this.http.post<AddLeadResponse>(this.baseUrl, payload);
  }

  getLeadSources(): Observable<LeadLookupItem[]> {
    return this.http.get<LeadLookupItem[]>(`${this.lookupBaseUrl}/sources`);
  }

  getLeadStatusLookup(): Observable<LeadLookupItem[]> {
    return this.http.get<LeadLookupItem[]>(`${this.lookupBaseUrl}/statuses`);
  }
}
